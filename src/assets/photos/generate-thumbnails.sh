#!/usr/bin/env bash
# Generate 800px-wide JPEG thumbnails for all photos in subfolders.
# Uses Python/PIL to correctly handle EXIF orientation (portrait photos).
# Usage: bash src/assets/photos/generate-thumbnails.sh
# Requires: python3 with Pillow

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

python3 - "$SCRIPT_DIR" <<'PYEOF'
import sys, os
from pathlib import Path
from PIL import Image, ImageOps

THUMB_WIDTH = 800
QUALITY = 80
base = Path(sys.argv[1])

for folder in sorted(base.iterdir()):
    if not folder.is_dir() or folder.name == "thumbs":
        continue

    thumbdir = folder / "thumbs"
    thumbdir.mkdir(exist_ok=True)

    for src in sorted(folder.iterdir()):
        if not src.is_file():
            continue
        if src.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
            continue

        out = thumbdir / (src.stem.lower() + ".jpg")

        # Incremental: skip if thumbnail is newer than source
        if out.exists() and out.stat().st_mtime > src.stat().st_mtime:
            print(f"SKIP  {out} (up to date)")
            continue

        print(f"THUMB {src} -> {out}")
        img = Image.open(src)
        img = ImageOps.exif_transpose(img)  # apply EXIF rotation
        img.thumbnail((THUMB_WIDTH, 99999), Image.LANCZOS)
        img.save(out, "JPEG", quality=QUALITY)

print("Done.")
PYEOF
