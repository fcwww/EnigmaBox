function shiftLetter(code: number, shift: number, base: number) {
  const offset = code - base;
  const s = ((offset + shift) % 26 + 26) % 26;
  return String.fromCharCode(base + s);
}

export function caesarShift(text: string, shift: number): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) out += shiftLetter(code, shift, 65);
    else if (code >= 97 && code <= 122) out += shiftLetter(code, shift, 97);
    else out += ch;
  }
  return out;
}

export function caesarAllShifts(text: string): Array<{ shift: number; result: string }> {
  const out: Array<{ shift: number; result: string }> = [];
  for (let s = 1; s <= 25; s++) out.push({ shift: s, result: caesarShift(text, s) });
  return out;
}

