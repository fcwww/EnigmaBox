from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def _is_bg(px: tuple[int, int, int, int], tol: int) -> bool:
    r, g, b, a = px
    if a == 0:
        return True
    # "white-ish" background from screenshots.
    return r >= 255 - tol and g >= 255 - tol and b >= 255 - tol


def _flood_fill_bg_mask(img: Image.Image, tol: int) -> list[list[bool]]:
    w, h = img.size
    mask = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if x < 0 or x >= w or y < 0 or y >= h:
            return
        if mask[y][x]:
            return
        if not _is_bg(img.getpixel((x, y)), tol):
            return
        mask[y][x] = True
        q.append((x, y))

    # Seed from edges only: avoids deleting interior highlights.
    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)

    return mask


def _apply_alpha(img: Image.Image, bg_mask: list[list[bool]]) -> Image.Image:
    w, h = img.size
    out = img.copy()
    px = out.load()
    for y in range(h):
        row = bg_mask[y]
        for x in range(w):
            if row[x]:
                r, g, b, _a = px[x, y]
                px[x, y] = (r, g, b, 0)
    return out


def _trim_and_square(img: Image.Image) -> Image.Image:
    # Trim transparent border
    bbox = img.getbbox()
    if bbox is None:
        return img
    cropped = img.crop(bbox)

    w, h = cropped.size
    s = max(w, h)
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    canvas.paste(cropped, ((s - w) // 2, (s - h) // 2))
    return canvas


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("Usage: python scripts/make-icons.py <input.png> [--tol N]", file=sys.stderr)
        return 2

    inp = Path(argv[1])
    tol = 12
    if "--tol" in argv:
        i = argv.index("--tol")
        tol = int(argv[i + 1])

    if not inp.exists():
        print(f"Input not found: {inp}", file=sys.stderr)
        return 2

    root = Path(__file__).resolve().parents[1]
    assets = root / "assets"
    build = root / "build"
    assets.mkdir(parents=True, exist_ok=True)
    build.mkdir(parents=True, exist_ok=True)

    im = Image.open(inp).convert("RGBA")
    mask = _flood_fill_bg_mask(im, tol=tol)
    cut = _apply_alpha(im, mask)
    squared = _trim_and_square(cut)

    # High-res base PNG (keep good quality for downscales)
    base = squared.resize((1024, 1024), Image.LANCZOS)
    out_png = assets / "icon.png"
    base.save(out_png)

    # Windows ICO (multiple sizes)
    out_ico = build / "icon.ico"
    base.save(out_ico, sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

    print(f"Written: {out_png}")
    print(f"Written: {out_ico}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

