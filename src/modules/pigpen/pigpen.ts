export type PigpenGridPos =
  | "tl"
  | "tm"
  | "tr"
  | "ml"
  | "mm"
  | "mr"
  | "bl"
  | "bm"
  | "br";

export type PigpenXPos = "top" | "right" | "bottom" | "left";

export function gridPosToLetter(pos: PigpenGridPos, dotted: boolean): string {
  const base = {
    tl: "A",
    tm: "B",
    tr: "C",
    ml: "D",
    mm: "E",
    mr: "F",
    bl: "G",
    bm: "H",
    br: "I"
  } as const;
  const offset = dotted ? 9 : 0;
  const letter = base[pos].charCodeAt(0) + offset;
  return String.fromCharCode(letter);
}

export function xPosToLetter(pos: PigpenXPos, dotted: boolean): string {
  const base = {
    top: "S",
    right: "T",
    bottom: "U",
    left: "V"
  } as const;
  const offset = dotted ? 4 : 0;
  const letter = base[pos].charCodeAt(0) + offset;
  return String.fromCharCode(letter);
}

