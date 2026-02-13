const A = "A".charCodeAt(0);
const Z = "Z".charCodeAt(0);

export function lettersToA1Z26(input: string): number[] {
  const out: number[] = [];
  for (const ch of input.toUpperCase()) {
    const code = ch.charCodeAt(0);
    if (code >= A && code <= Z) out.push(code - A + 1);
  }
  return out;
}

export function a1z26ToLetters(nums: number[]): string {
  return nums
    .map((n) => {
      if (!Number.isFinite(n)) return "?";
      const nn = Math.trunc(n);
      if (nn < 1 || nn > 26) return "?";
      return String.fromCharCode(A + nn - 1);
    })
    .join("");
}

export function parseDecimalNumbers(input: string): number[] {
  const tokens = input
    .trim()
    .split(/[^0-9]+/g)
    .filter(Boolean);
  return tokens.map((t) => Number.parseInt(t, 10)).filter((n) => Number.isFinite(n));
}

export function toBinary5(nums: number[]): string {
  return nums
    .map((n) => {
      const v = Math.trunc(n);
      if (v < 0 || v > 31) return "?????";
      return v.toString(2).padStart(5, "0");
    })
    .join(" ");
}

export function parseBinary5(input: string): number[] {
  const cleaned = input.replace(/[^01]/g, "");
  const out: number[] = [];
  for (let i = 0; i + 5 <= cleaned.length; i += 5) {
    const chunk = cleaned.slice(i, i + 5);
    out.push(Number.parseInt(chunk, 2));
  }
  return out;
}

export function toTernary3(nums: number[]): string {
  return nums
    .map((n) => {
      const v = Math.trunc(n);
      if (v < 0 || v > 26) return "???";
      return v.toString(3).padStart(3, "0");
    })
    .join(" ");
}

export function parseTernary3(input: string): number[] {
  const cleaned = input.replace(/[^0-2]/g, "");
  const out: number[] = [];
  for (let i = 0; i + 3 <= cleaned.length; i += 3) {
    const chunk = cleaned.slice(i, i + 3);
    out.push(Number.parseInt(chunk, 3));
  }
  return out;
}

// “四位康拓展开”（本项目按 puzzle hunt 常见用法处理）：
// 输入一个由 1..4 构成的排列（例如 1234、1243、...），用康托展开/排列排名得到 0..23 的序号。
// 映射规则：rank=0 -> A；rank=1 -> B ... rank=23 -> X。
export function parseCantor4Digits(input: string): number[] {
  // 兼容输入：1234、1 2 3 4、1,2,3,4 等 —— 直接抽取所有数字。
  return (input.match(/\d/g) ?? []).map((c) => Number.parseInt(c, 10));
}

function factorial(n: number): number {
  let v = 1;
  for (let i = 2; i <= n; i++) v *= i;
  return v;
}

export function cantor4ToA1Z26(digits: number[]): { value: number; a1z26: number } | null {
  if (digits.length !== 4) return null;
  const perm = digits.map((d) => Math.trunc(d));
  if (perm.some((d) => d < 1 || d > 4)) return null;
  const set = new Set(perm);
  if (set.size !== 4) return null;

  const remaining = [1, 2, 3, 4];
  let rank = 0;
  for (let i = 0; i < 4; i++) {
    const x = perm[i];
    const idx = remaining.indexOf(x);
    if (idx === -1) return null;
    rank += idx * factorial(3 - i);
    remaining.splice(idx, 1);
  }

  return { value: rank, a1z26: rank + 1 };
}
