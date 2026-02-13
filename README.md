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

## Development

See `DEVELOPMENT.md` (Chinese).
