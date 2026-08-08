import { app } from "electron";

import {
  a1z26ToLetters,
  cantor4ToA1Z26,
  lettersToA1Z26,
  parseBinary5,
  parseCantor4Digits,
  parseDecimalNumbers,
  parseTernary3,
  toBinary5,
  toTernary3
} from "../../modules/a1z26/a1z26";
import { dotsToMask, maskToLetter } from "../../modules/braille/braille";
import { caesarAllShifts, caesarShift } from "../../modules/caesar/caesar";
import { decodeFromMorse, encodeToMorse } from "../../modules/morse/morse";
import { gridPosToLetter, xPosToLetter, type PigpenGridPos, type PigpenXPos } from "../../modules/pigpen/pigpen";
import { semaphorePairToLetter } from "../../modules/semaphore/semaphore";
import type { CandidateAnalysis, LlmSettingsSummary } from "../../shared/word-search";
import { analyzeCandidates, getLlmSettingsSummary, saveLlmSettings, searchNutrimatic } from "../word-search";

type FlagValue = string | true;

interface ParsedArguments {
  positionals: string[];
  flags: Map<string, FlagValue>;
}

const HELP = `EnigmaBox CLI

Usage:
  npm run cli -- <command> [arguments] [--json]

Commands:
  a1z26 letters <text>             Convert letters to decimal, 5-bit binary, and ternary.
  a1z26 decimal <numbers>          Convert A1Z26 decimal numbers to letters.
  a1z26 binary <bits>              Decode 5-bit binary A1Z26.
  a1z26 ternary <digits>           Decode 3-digit ternary A1Z26.
  a1z26 cantor <permutations>     Decode 1..4 permutations with Cantor ranking.
  caesar shift <text> --shift N    Apply a Caesar shift.
  caesar all <text>                Show all 25 Caesar shifts.
  morse encode <text>              Encode text as Morse.
  morse decode <morse>             Decode Morse (use / or | between words).
  braille --dots 1,2,4             Decode one six-dot Braille cell.
  semaphore --positions 5,6        Decode one semaphore flag pair (positions 1..8).
  pigpen grid --position tl        Decode a Pigpen 3x3 cell; add --dotted for J-R.
  pigpen x --position top          Decode a Pigpen X cell; add --dotted for W-Z.
  nutrimatic <expression>          Search Nutrimatic and print candidates.
  rank <word...>                   Sort candidates by commonness and translate them with the global AI.
  ai config show                   Show global AI connection settings.
  ai config set [options]          Save global settings: --endpoint URL --model NAME --api-key KEY.
  ai config clear-key              Remove the saved global API key.

Options:
  --json                           Print machine-readable JSON.
  --input TEXT                     Alternative to positional text input.
  --limit N                        Limit displayed Nutrimatic candidates (default: 50).
  --candidates LIST                For rank: comma/newline-separated candidates.

Examples:
  npm run cli -- morse encode "HELLO WORLD"
  npm run cli -- caesar shift KHOOR --shift -3
  npm run cli -- nutrimatic "<integral>" --limit 10
  npm run cli -- rank teach touch torch
  npm run cli -- ai config set --api-key sk-... --model deepseek-chat
`;

function parseArguments(tokens: string[]): ParsedArguments {
  const positionals: string[] = [];
  const flags = new Map<string, FlagValue>();
  const booleanFlags = new Set(["json", "dotted", "help"]);

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index] ?? "";
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    const [rawName, inlineValue] = token.slice(2).split("=", 2);
    if (!rawName) throw new Error("选项名称不能为空。");
    if (inlineValue !== undefined) {
      flags.set(rawName, inlineValue);
      continue;
    }

    if (booleanFlags.has(rawName)) {
      flags.set(rawName, true);
      continue;
    }

    const next = tokens[index + 1];
    if (next && !next.startsWith("--")) {
      flags.set(rawName, next);
      index++;
    } else {
      flags.set(rawName, true);
    }
  }

  return { positionals, flags };
}

function flagValue(args: ParsedArguments, name: string): string | undefined {
  const value = args.flags.get(name);
  if (value === true) throw new Error(`选项 --${name} 需要一个值。`);
  return value;
}

function flagNumber(args: ParsedArguments, name: string, defaultValue?: number): number {
  const raw = flagValue(args, name);
  if (raw === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`缺少 --${name}。`);
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`--${name} 必须是数字。`);
  return value;
}

function requiredText(args: ParsedArguments, label: string): string {
  const fromFlag = flagValue(args, "input");
  const value = fromFlag ?? args.positionals.join(" ");
  if (!value.trim()) throw new Error(`请提供${label}。`);
  return value;
}

function writeResult(value: unknown, text: string, asJson: boolean): void {
  process.stdout.write(asJson ? `${JSON.stringify(value, null, 2)}\n` : `${text}\n`);
}

function textForSettings(settings: LlmSettingsSummary): string {
  return [
    `Endpoint: ${settings.endpoint}`,
    `Model: ${settings.model}`,
    `API Key: ${settings.hasApiKey ? "saved" : "not configured"}`,
    `Storage: ${settings.keyStorage}`
  ].join("\n");
}

function parseDots(value: string): boolean[] {
  if (!/^[\d\s,;:/-]+$/.test(value)) {
    throw new Error("--dots 使用 1..6 的逗号分隔列表，例如 1,2,4。\n");
  }
  const dots = value.split(/[^0-9]+/).filter(Boolean).map((part) => Number(part));
  if (dots.length === 0 || dots.some((dot) => !Number.isInteger(dot) || dot < 1 || dot > 6)) {
    throw new Error("--dots 使用 1..6 的逗号分隔列表，例如 1,2,4。\n");
  }
  return Array.from({ length: 6 }, (_, index) => dots.includes(index + 1));
}

function parsePair(value: string): [number, number] {
  if (!/^[\d\s,;:/-]+$/.test(value)) {
    throw new Error("--positions 使用两个 1..8 的位置，例如 5,6。\n");
  }
  const positions = value.split(/[^0-9]+/).filter(Boolean).map((part) => Number(part));
  if (positions.length !== 2 || positions.some((position) => !Number.isInteger(position) || position < 1 || position > 8)) {
    throw new Error("--positions 使用两个 1..8 的位置，例如 5,6。\n");
  }
  return [positions[0] ?? 0, positions[1] ?? 0];
}

function parseCandidates(args: ParsedArguments): string[] {
  const value = flagValue(args, "candidates") ?? flagValue(args, "input") ?? args.positionals.join("\n");
  return value
    .split(/[\n,;]+/)
    .map((candidate) => candidate.trim())
    .filter(Boolean);
}

async function runA1Z26(action: string | undefined, args: ParsedArguments, asJson: boolean): Promise<void> {
  const input = requiredText(args, "A1Z26 输入");
  if (action === "letters") {
    const numbers = lettersToA1Z26(input);
    const result = { input, decimal: numbers, binary5: toBinary5(numbers), ternary3: toTernary3(numbers) };
    writeResult(result, [`Decimal: ${numbers.join(" ")}`, `Binary5: ${result.binary5}`, `Ternary3: ${result.ternary3}`].join("\n"), asJson);
    return;
  }

  if (action === "decimal") {
    const numbers = parseDecimalNumbers(input);
    const result = { input, output: a1z26ToLetters(numbers) };
    writeResult(result, result.output, asJson);
    return;
  }

  if (action === "binary") {
    const result = { input, output: a1z26ToLetters(parseBinary5(input)) };
    writeResult(result, result.output, asJson);
    return;
  }

  if (action === "ternary") {
    const result = { input, output: a1z26ToLetters(parseTernary3(input)) };
    writeResult(result, result.output, asJson);
    return;
  }

  if (action === "cantor") {
    const digits = parseCantor4Digits(input);
    if (digits.length === 0 || digits.length % 4 !== 0) {
      throw new Error("康托模式需要一个或多个 4 位 1..4 排列。\n");
    }
    const decoded = [] as Array<{ permutation: string; rank: number; letter: string }>;
    for (let index = 0; index < digits.length; index += 4) {
      const permutation = digits.slice(index, index + 4);
      const mapped = cantor4ToA1Z26(permutation);
      if (!mapped) throw new Error(`无效排列：${permutation.join("")}。\n`);
      decoded.push({ permutation: permutation.join(""), rank: mapped.value, letter: a1z26ToLetters([mapped.a1z26]) });
    }
    const result = { input, output: decoded.map((item) => item.letter).join(""), decoded };
    writeResult(result, `${result.output}\n${decoded.map((item) => `${item.permutation} -> ${item.letter} (rank ${item.rank})`).join("\n")}`, asJson);
    return;
  }

  throw new Error("A1Z26 子命令应为 letters、decimal、binary、ternary 或 cantor。\n");
}

async function runCaesar(action: string | undefined, args: ParsedArguments, asJson: boolean): Promise<void> {
  const input = requiredText(args, "Caesar 输入");
  if (action === "shift") {
    const shift = Math.trunc(flagNumber(args, "shift"));
    const result = { input, shift, output: caesarShift(input, shift) };
    writeResult(result, result.output, asJson);
    return;
  }
  if (action === "all") {
    const shifts = caesarAllShifts(input);
    writeResult({ input, shifts }, shifts.map((item) => `shift=${item.shift}\t${item.result}`).join("\n"), asJson);
    return;
  }
  throw new Error("Caesar 子命令应为 shift 或 all。\n");
}

async function runMorse(action: string | undefined, args: ParsedArguments, asJson: boolean): Promise<void> {
  const input = requiredText(args, "Morse 输入");
  if (action === "encode") {
    const result = { input, output: encodeToMorse(input) };
    writeResult(result, result.output, asJson);
    return;
  }
  if (action === "decode") {
    const result = { input, output: decodeFromMorse(input) };
    writeResult(result, result.output, asJson);
    return;
  }
  throw new Error("Morse 子命令应为 encode 或 decode。\n");
}

function runBraille(args: ParsedArguments, asJson: boolean): void {
  const rawDots = flagValue(args, "dots");
  if (!rawDots) throw new Error("Braille 需要 --dots，例如 --dots 1,2,4。\n");
  const dots = parseDots(rawDots);
  const mask = dotsToMask(dots);
  const output = maskToLetter(mask);
  if (!output) throw new Error("该点阵没有对应的基础拉丁字母。\n");
  writeResult({ dots: rawDots, mask, output }, output, asJson);
}

function runSemaphore(args: ParsedArguments, asJson: boolean): void {
  const rawPositions = flagValue(args, "positions");
  if (!rawPositions) throw new Error("Semaphore 需要 --positions，例如 --positions 5,6。\n");
  const [first, second] = parsePair(rawPositions);
  const output = semaphorePairToLetter(first, second);
  if (!output) throw new Error("该旗语位置组合没有对应字母。\n");
  writeResult({ positions: [first, second], output }, output, asJson);
}

function runPigpen(action: string | undefined, args: ParsedArguments, asJson: boolean): void {
  const position = flagValue(args, "position");
  const dotted = args.flags.has("dotted");
  if (!position) throw new Error("Pigpen 需要 --position。\n");
  if (action === "grid") {
    const valid: PigpenGridPos[] = ["tl", "tm", "tr", "ml", "mm", "mr", "bl", "bm", "br"];
    if (!valid.includes(position as PigpenGridPos)) throw new Error(`grid 的 --position 应为 ${valid.join("、")}。\n`);
    const output = gridPosToLetter(position as PigpenGridPos, dotted);
    writeResult({ position, dotted, output }, output, asJson);
    return;
  }
  if (action === "x") {
    const valid: PigpenXPos[] = ["top", "right", "bottom", "left"];
    if (!valid.includes(position as PigpenXPos)) throw new Error(`x 的 --position 应为 ${valid.join("、")}。\n`);
    const output = xPosToLetter(position as PigpenXPos, dotted);
    writeResult({ position, dotted, output }, output, asJson);
    return;
  }
  throw new Error("Pigpen 子命令应为 grid 或 x。\n");
}

async function runNutrimatic(args: ParsedArguments, asJson: boolean): Promise<void> {
  const query = requiredText(args, "Nutrimatic 表达式");
  const result = await searchNutrimatic(query);
  const limit = Math.max(1, Math.min(150, Math.trunc(flagNumber(args, "limit", 50))));
  const display = { ...result, candidates: result.candidates.slice(0, limit) };
  const text = [`Source: ${result.sourceUrl}`, ...display.candidates.map((candidate) => `${candidate.rank}\t${candidate.text}`)].join("\n");
  writeResult(display, text, asJson);
}

function formatAnalysis(analysis: CandidateAnalysis): string {
  return analysis.recommendations
    .map((item, index) => `${index + 1}\t${item.candidate}\t${item.commonness}\t${item.translation}`)
    .join("\n");
}

async function runRank(args: ParsedArguments, asJson: boolean): Promise<void> {
  const candidates = parseCandidates(args);
  if (candidates.length === 0) throw new Error("请提供至少一个候选词。\n");
  const result = await analyzeCandidates({ candidates });
  writeResult(result, formatAnalysis(result), asJson);
}

async function runAi(action: string | undefined, subaction: string | undefined, args: ParsedArguments, asJson: boolean): Promise<void> {
  if (action !== "config") throw new Error("AI 子命令应为 config。\n");
  if (subaction === "show") {
    const settings = await getLlmSettingsSummary();
    writeResult(settings, textForSettings(settings), asJson);
    return;
  }

  const current = await getLlmSettingsSummary();
  if (subaction === "set") {
    const settings = await saveLlmSettings({
      endpoint: flagValue(args, "endpoint") ?? current.endpoint,
      model: flagValue(args, "model") ?? current.model,
      apiKey: flagValue(args, "api-key")
    });
    writeResult(settings, textForSettings(settings), asJson);
    return;
  }

  if (subaction === "clear-key") {
    const settings = await saveLlmSettings({ endpoint: current.endpoint, model: current.model, clearApiKey: true });
    writeResult(settings, textForSettings(settings), asJson);
    return;
  }

  throw new Error("AI config 子命令应为 show、set 或 clear-key。\n");
}

async function run(argv: string[]): Promise<void> {
  const parsed = parseArguments(argv);
  const asJson = parsed.flags.has("json");
  const [command, action, ...rest] = parsed.positionals;
  const commandArgs: ParsedArguments = { positionals: rest, flags: parsed.flags };

  if (!command || command === "help" || parsed.flags.has("help")) {
    process.stdout.write(HELP);
    return;
  }

  if (command === "a1z26") return runA1Z26(action, commandArgs, asJson);
  if (command === "caesar") return runCaesar(action, commandArgs, asJson);
  if (command === "morse") return runMorse(action, commandArgs, asJson);
  if (command === "braille") return runBraille(commandArgs, asJson);
  if (command === "semaphore") return runSemaphore(commandArgs, asJson);
  if (command === "pigpen") return runPigpen(action, commandArgs, asJson);
  if (command === "nutrimatic") return runNutrimatic({ positionals: [action, ...rest].filter(Boolean) as string[], flags: parsed.flags }, asJson);
  if (command === "rank") return runRank({ positionals: [action, ...rest].filter(Boolean) as string[], flags: parsed.flags }, asJson);
  if (command === "ai") return runAi(action, rest[0], { positionals: rest.slice(1), flags: parsed.flags }, asJson);

  throw new Error(`未知命令：${command}。\n`);
}

app.whenReady()
  .then(() => run(process.argv.slice(2)))
  .then(() => app.exit(0))
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n\n${HELP}`);
    app.exit(1);
  });
