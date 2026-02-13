const TEXT_TO_MORSE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  ":": "---...",
  ";": "-.-.-.",
  "(": "-.--.",
  ")": "-.--.-",
  "/": "-..-.",
  "-": "-....-",
  "'": ".----.",
  "\"": ".-..-.",
  "@": ".--.-."
};

const MORSE_TO_TEXT: Record<string, string> = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([k, v]) => [v, k])
);

export function encodeToMorse(text: string): string {
  const words = text
    .toUpperCase()
    .split(/\s+/g)
    .filter(Boolean);
  return words
    .map((word) =>
      Array.from(word)
        .map((ch) => TEXT_TO_MORSE[ch] ?? "?")
        .join(" ")
    )
    .join(" / ");
}

export function decodeFromMorse(morse: string): string {
  const parts = morse
    .trim()
    .replace(/\|/g, "/")
    .split(/\s+/g)
    .filter(Boolean);

  let out = "";
  for (const token of parts) {
    if (token === "/" || token === "／") out += " ";
    else out += MORSE_TO_TEXT[token] ?? "?";
  }
  return out;
}

