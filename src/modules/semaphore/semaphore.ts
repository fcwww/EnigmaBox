// 8 positions (clockwise):
// 1: ↑, 2: ↗, 3: →, 4: ↘, 5: ↓, 6: ↙, 7: ←, 8: ↖
// Standard semaphore alphabet as seen facing the signaler.
// Letters are arranged in the usual semaphore circles:
// A-G, H-I/K-N, O-S, T-U/Y, J/V, W-X, Z.
const PAIRS: Array<[number, number, string]> = [
  [5, 6, "A"],
  [5, 7, "B"],
  [5, 8, "C"],
  [1, 5, "D"],
  [2, 5, "E"],
  [3, 5, "F"],
  [4, 5, "G"],
  [6, 7, "H"],
  [6, 8, "I"],
  [1, 3, "J"],
  [1, 6, "K"],
  [2, 6, "L"],
  [3, 6, "M"],
  [4, 6, "N"],
  [7, 8, "O"],
  [1, 7, "P"],
  [2, 7, "Q"],
  [3, 7, "R"],
  [4, 7, "S"],
  [1, 8, "T"],
  [2, 8, "U"],
  [1, 4, "V"],
  [2, 3, "W"],
  [2, 4, "X"],
  [3, 8, "Y"],
  [3, 4, "Z"]
];

const KEY_TO_LETTER = new Map<string, string>();
for (const [a, b, ch] of PAIRS) KEY_TO_LETTER.set(`${a}-${b}`, ch);

export function semaphorePairToLetter(a: number, b: number): string | null {
  if (a === b) return null;
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  return KEY_TO_LETTER.get(`${x}-${y}`) ?? null;
}

