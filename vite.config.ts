import { fileURLToPath, URL } from 'node:url'
import { createReadStream, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const PHOTO_DIR = fileURLToPath(new URL('./src/assets/photos', import.meta.url))
const PHOTO_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}
const MANIFEST_ID = 'virtual:photo-manifest'

// Relative paths of every photo under PHOTO_DIR, e.g. "1 China 2025/thumbs/just-a-cat.jpg"
function listPhotos(dir: string, prefix = ''): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) return listPhotos(path.join(dir, entry.name), rel)
    return PHOTO_TYPES[path.extname(entry.name).toLowerCase()] ? [rel] : []
  })
}

// Exposes the photo list as `virtual:photo-manifest` without bundling the images —
// in production they're fetched from the CDN. In dev, serves them locally at /photos.
function photoManifest(): Plugin {
  return {
    name: 'photo-manifest',
    resolveId(id) {
      if (id === MANIFEST_ID) return '\0' + MANIFEST_ID
    },
    load(id) {
      if (id === '\0' + MANIFEST_ID) return `export default ${JSON.stringify(listPhotos(PHOTO_DIR))}`
    },
    configureServer(server) {
      server.middlewares.use('/photos', (req, res, next) => {
        const rel = decodeURIComponent((req.url ?? '').split('?')[0])
        const file = path.join(PHOTO_DIR, rel)
        const type = PHOTO_TYPES[path.extname(file).toLowerCase()]
        if (!file.startsWith(PHOTO_DIR + path.sep) || !type) return next()
        try {
          res.setHeader('Content-Length', statSync(file).size)
        } catch {
          return next()
        }
        res.setHeader('Content-Type', type)
        createReadStream(file).pipe(res)
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    photoManifest(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  assetsInclude: ['./public', '**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.GIF', '**/*.WEBP']
})
