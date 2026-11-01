#!/usr/bin/env bash
# Upload photos (full-res + thumbs) to the R2 bucket served through the Cloudflare CDN.
# Keys mirror the paths under src/assets/photos, matching the URLs PhotoViewerApp builds.
# Usage: CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... ./scripts/upload-photos.sh
set -euo pipefail

BUCKET="${PHOTO_BUCKET:-alexanderlx-photos}"
PHOTO_DIR="src/assets/photos"

cd "$(dirname "${BASH_SOURCE[0]}")/.."

find "$PHOTO_DIR" -type f \( \
  -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.webp' \
\) -print0 | sort -z | while IFS= read -r -d '' file; do
  key="${file#"$PHOTO_DIR"/}"
  case "${file,,}" in
    *.png)  type=image/png ;;
    *.gif)  type=image/gif ;;
    *.webp) type=image/webp ;;
    *)      type=image/jpeg ;;
  esac
  echo "PUT $key"
  npx wrangler r2 object put "$BUCKET/$key" --remote --file "$file" \
    --content-type "$type" --cache-control "public, max-age=604800"
done

echo "Done."
