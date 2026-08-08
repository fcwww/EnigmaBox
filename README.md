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
- 可配置 LLM 分析：兼容 DeepSeek 等 OpenAI Chat Completions 接口，按题面上下文给候选排序

## Nutrimatic 猜词与 AI 分析

打开左侧“**Nutrimatic 猜词**”工具：

1. 输入 Nutrimatic 表达式并点击“获取候选”。候选来自 Nutrimatic 2024 词库，结果保留原始排序。
2. 可选填写题面上下文；手动选择候选后点击“让 AI 排序”。
3. 在左侧“全局 AI 设置”里填写 Chat Completions URL、模型名称和 API Key。默认值适用于 DeepSeek：`https://api.deepseek.com/chat/completions` 与 `deepseek-chat`。

AI 请求使用专门的系统提示词，将表达式、题面和词库候选标记为不可信数据，并要求模型返回结构化 JSON。全局 API Key 由 Electron 主进程保存到本机用户数据目录；系统支持安全存储时会加密保存。

## Development

See `DEVELOPMENT.md` (Chinese).
