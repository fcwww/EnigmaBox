// 8 positions (clockwise):
// 1: ↑, 2: ↗, 3: →, 4: ↘, 5: ↓, 6: ↙, 7: ←, 8: ↖
// Standard semaphore letters (A-Z) mapping by two flag positions.
const PAIRS: Array<[number, number, string]> = [
  [1, 2, "A"],
  [1, 3, "B"],
  [1, 4, "C"],
  [1, 5, "D"],
  [1, 6, "E"],
  [1, 7, "F"],
  [1, 8, "G"],
  [2, 3, "H"],
  [2, 4, "I"],
  [2, 5, "J"],
  [2, 6, "K"],
  [2, 7, "L"],
  [2, 8, "M"],
  [3, 4, "N"],
  [3, 5, "O"],
  [3, 6, "P"],
  [3, 7, "Q"],
  [3, 8, "R"],
  [4, 5, "S"],
  [4, 6, "T"],
  [4, 7, "U"],
  [5, 6, "V"],
  [5, 7, "W"],
  [5, 8, "X"],
  [6, 7, "Y"],
  [6, 8, "Z"]
];

const KEY_TO_LETTER = new Map<string, string>();
for (const [a, b, ch] of PAIRS) KEY_TO_LETTER.set(`${a}-${b}`, ch);

export function semaphorePairToLetter(a: number, b: number): string | null {
  if (a === b) return null;
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  return KEY_TO_LETTER.get(`${x}-${y}`) ?? null;
}

