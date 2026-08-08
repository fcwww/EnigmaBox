# EnigmaBox

A lightweight cipher toolbox for Puzzle Hunts. Built and packaged for **Windows-first** workflows.

## Tech Stack

- Electron + Vue 3 + Vite + TypeScript
- Tailwind CSS (dark + glassmorphism + strong interactive feedback)
- Chinese UI (for now)

## Features (Current)

- A1Z26 tool:
  - Decimal / 5-bit binary / 3-digit ternary
  - “Cantor expansion (perm 1..4) -> A1Z26” (e.g. `1234 => A`, `1243 => B`, output range `A..X`)
- Caesar cipher: shows all 25 shifts with shift labels
- Morse code: interactive `.` / `-` input, encode + decode
- Braille decoder: interactive 2x3 dots, live preview, append output (basic a-z)
- Semaphore (flag) decoder: 8-direction picker (choose two), live preview, append output (A-Z)
- Pigpen cipher decoder: 3x3 grid + X-grid picker, click glyphs to append letters (A-Z)
- Nutrimatic 猜词：输入表达式，获取并筛选候选词
- 可配置 LLM 分析：兼容 DeepSeek 等 OpenAI Chat Completions 接口，按英文常见度给候选排序并提供中文释义

## Nutrimatic 猜词与 AI 分析

打开左侧“**Nutrimatic 猜词**”工具：

1. 输入 Nutrimatic 表达式并点击“获取候选”。候选来自 Nutrimatic 2024 词库，结果保留原始排序。
2. 手动选择候选后点击“让 AI 排序”。AI 只依据英文常见度排序，并为每个候选提供简短中文释义。
3. 在左侧“全局 AI 设置”里填写 Chat Completions URL、模型名称和 API Key。默认值适用于 DeepSeek：`https://api.deepseek.com/chat/completions` 与 `deepseek-chat`。

AI 请求使用专门的系统提示词，将候选词作为数据处理，并要求模型返回结构化 JSON。全局 API Key 由 Electron 主进程保存到本机用户数据目录；系统支持安全存储时会加密保存。

## CLI

所有工具也提供统一命令行入口。先在项目根目录执行：

```bash
npm run cli -- help
```

常用命令示例：

```bash
npm run cli -- a1z26 letters HELLO
npm run cli -- a1z26 decimal "8 5 12 12 15"
npm run cli -- a1z26 binary "01000 00101"
npm run cli -- a1z26 ternary "022 012"
npm run cli -- a1z26 cantor "1234 1243"
npm run cli -- caesar shift KHOOR --shift -3
npm run cli -- caesar all KHOOR
npm run cli -- morse encode "HELLO WORLD"
npm run cli -- morse decode ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
npm run cli -- braille --dots 1,2,4
npm run cli -- semaphore --positions 5,6
npm run cli -- pigpen grid --position tl
npm run cli -- pigpen x --position top --dotted
npm run cli -- nutrimatic "<integral>" --limit 10
npm run cli -- rank teach touch torch
```

`rank` 使用全局 AI 设置进行常见度排序和中文翻译。设置可通过 GUI 的“全局 AI 设置”页面完成，也可通过 CLI 管理：

```bash
npm run cli -- ai config show
npm run cli -- ai config set --endpoint https://api.deepseek.com/chat/completions --model deepseek-chat --api-key YOUR_KEY
npm run cli -- ai config clear-key
```

加上 `--json` 可输出机器可读结果，例如 `npm run --silent cli -- a1z26 letters HELLO --json`。文本输入支持位置参数或 `--input TEXT`；`rank` 也支持 `--candidates "word1,word2"`。Nutrimatic 的 `--limit` 范围为 1 到 150，`braille` 的点位为 1 到 6，`semaphore` 的旗语位置为两个 1 到 8 的数字。

## Development

See `DEVELOPMENT.md` (Chinese).
