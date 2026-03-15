#!/usr/bin/env bash
set -euo pipefail

DIST="dist/client"
ZIP_NAME="build.zip"

usage() {
  echo "Usage: ./build.sh [--no-photos] [--no-zip]"
  echo ""
  echo "  --no-photos   Exclude photo assets (JPG/JPEG/PNG/GIF/WEBP) from the output."
  echo "                Useful for text-only changes — cuts ~700MB from the build."
  echo "  --no-zip      Skip zipping the output folder."
  echo ""
  echo "Output: $DIST/ and $ZIP_NAME (unless --no-zip)"
  exit 0
}

SKIP_PHOTOS=false
SKIP_ZIP=false

for arg in "$@"; do
  case "$arg" in
    --no-photos) SKIP_PHOTOS=true ;;
    --no-zip)    SKIP_ZIP=true ;;
    --help|-h)   usage ;;
    *) echo "Unknown option: $arg"; usage ;;
  esac
done

echo "==> Building project..."
npm run build

if $SKIP_PHOTOS; then
  echo "==> Removing photo assets from build..."
  find "$DIST/assets" -type f \( \
    -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \
    -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.avif' \
  \) -delete

  # Also remove photos copied from public/
  if [ -d "$DIST/images" ]; then
    rm -rf "$DIST/images"
  fi

  SIZE=$(du -sh "$DIST" | cut -f1)
  echo "    Build size (no photos): $SIZE"
else
  SIZE=$(du -sh "$DIST" | cut -f1)
  echo "    Build size: $SIZE"
fi

if ! $SKIP_ZIP; then
  echo "==> Zipping $DIST/ -> $ZIP_NAME..."
  rm -f "$ZIP_NAME"
  cd "$DIST"
  zip -rq "../../$ZIP_NAME" .
  cd ../..
  ZIP_SIZE=$(du -sh "$ZIP_NAME" | cut -f1)
  echo "    Zip size: $ZIP_SIZE"
  echo "==> Done: $ZIP_NAME"
else
  echo "==> Done: $DIST/"
fi
