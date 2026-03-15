<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

interface Photo {
  thumbUrl: string
  fullUrl: string
  caption: string
  filename: string
}

interface PhotoGroup {
  group: string       // display name (number prefix stripped)
  sortKey: number     // leading number for ordering
  folderKey: string   // raw folder name (for thumbnail matching)
  photos: Photo[]
}

interface PhotoLoadState {
  progress: number
  loaded: boolean
  displayUrl: string
}

// Auto-discover full-res photos (exclude thumbs/)
const fullModules = import.meta.glob(
  ['@/assets/photos/**/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}', '!@/assets/photos/**/thumbs/**'],
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

// Auto-discover thumbnails
const thumbModules = import.meta.glob(
  '@/assets/photos/**/thumbs/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

// Build a map of lowercase base name -> thumb URL for matching
const thumbMap = new Map<string, string>()
for (const [path, url] of Object.entries(thumbModules)) {
  // path like: /src/assets/photos/China 2025/thumbs/guangzhou-opera-house.jpg
  const filename = path.split('/').pop() || ''
  const baseName = filename.replace(/\.[^.]+$/, '').toLowerCase()
  // Include the folder in the key to avoid collisions across folders
  const parts = path.split('/')
  const thumbsIdx = parts.indexOf('thumbs')
  const folder = thumbsIdx > 0 ? parts[thumbsIdx - 1] : ''
  thumbMap.set(`${folder}::${baseName}`, url)
}

function kebabToCaption(filename: string): string {
  const name = filename.replace(/\.[^.]+$/, '')
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Parse leading number prefix from folder name: "3 Vietnam 2025" -> { sort: 3, display: "Vietnam 2025" }
function parseFolderName(raw: string): { sortKey: number; display: string } {
  const match = raw.match(/^(\d+)\s+(.*)$/)
  if (match) return { sortKey: parseInt(match[1], 10), display: match[2] }
  return { sortKey: Infinity, display: raw }
}

// Group photos by subfolder
const groupedPhotos: PhotoGroup[] = (() => {
  const groups = new Map<string, Photo[]>()

  for (const [path, url] of Object.entries(fullModules)) {
    // path like: /src/assets/photos/3 China 2025/guangzhou-opera-house.JPG
    const parts = path.split('/')
    const photosIdx = parts.indexOf('photos')
    // The folder is the segment right after "photos"
    const folder = photosIdx >= 0 && photosIdx + 2 < parts.length ? parts[photosIdx + 1] : 'Unsorted'
    const filename = parts.pop() || ''
    const baseName = filename.replace(/\.[^.]+$/, '').toLowerCase()

    // Find matching thumbnail (no fallback to full-res — grid only loads thumbs)
    const thumbUrl = thumbMap.get(`${folder}::${baseName}`) ?? ''

    if (!groups.has(folder)) {
      groups.set(folder, [])
    }
    groups.get(folder)!.push({
      thumbUrl,
      fullUrl: url,
      caption: kebabToCaption(filename),
      filename,
    })
  }

  // Sort groups by leading number prefix, photos by filename within each group
  return Array.from(groups.entries())
    .map(([rawFolder, photos]) => {
      const { sortKey, display } = parseFolderName(rawFolder)
      return {
        group: display,
        sortKey,
        folderKey: rawFolder,
        photos: photos.sort((a, b) => a.filename.localeCompare(b.filename)),
      }
    })
    .sort((a, b) => a.sortKey - b.sortKey)
})()

// Flat list for indexing (lightbox navigation, load state)
const allPhotos = computed(() => groupedPhotos.flatMap((g) => g.photos))
const totalCount = computed(() => allPhotos.value.length)

// Build a map of folderKey -> starting index into allPhotos
const groupStartIndex = computed(() => {
  const map = new Map<string, number>()
  let idx = 0
  for (const g of groupedPhotos) {
    map.set(g.folderKey, idx)
    idx += g.photos.length
  }
  return map
})

const loadState = reactive<Record<number, PhotoLoadState>>({})

function initLoadStates() {
  allPhotos.value.forEach((_, i) => {
    loadState[i] = { progress: 0, loaded: false, displayUrl: '' }
  })
}
initLoadStates()

const lightbox = ref<number | null>(null)
const lightboxFullLoaded = ref(false)
const lightboxFullUrl = ref('')
const lightboxProgress = ref(0)
let lightboxAbort: AbortController | null = null

async function loadFullRes(index: number) {
  lightboxAbort?.abort()
  const controller = new AbortController()
  lightboxAbort = controller
  lightboxFullLoaded.value = false
  lightboxFullUrl.value = ''
  lightboxProgress.value = 0

  const photo = allPhotos.value[index]
  try {
    const response = await fetch(photo.fullUrl, { signal: controller.signal })
    const contentLength = response.headers.get('Content-Length')

    if (!response.body) {
      const blob = await response.blob()
      if (controller.signal.aborted) return
      lightboxFullUrl.value = URL.createObjectURL(blob)
      lightboxProgress.value = 100
      lightboxFullLoaded.value = true
      return
    }

    const total = contentLength ? parseInt(contentLength, 10) : 0
    let received = 0
    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (controller.signal.aborted) return
      chunks.push(value)
      received += value.length
      if (total > 0) {
        lightboxProgress.value = Math.min((received / total) * 100, 99.9)
      } else {
        // No Content-Length: asymptotic progress (approaches but never reaches 100)
        lightboxProgress.value = Math.min((1 - Math.exp(-received / 2_000_000)) * 95, 99.9)
      }
    }

    if (controller.signal.aborted) return
    const blob = new Blob(chunks)
    lightboxFullUrl.value = URL.createObjectURL(blob)
    lightboxProgress.value = 100
    lightboxFullLoaded.value = true
  } catch {
    if (controller.signal.aborted) return
    // Fallback — use the URL directly
    lightboxFullUrl.value = photo.fullUrl
    lightboxProgress.value = 100
    lightboxFullLoaded.value = true
  }
}

async function loadImage(index: number) {
  const photo = allPhotos.value[index]
  try {
    // Fetch the thumbnail for the grid (smaller, faster)
    const response = await fetch(photo.thumbUrl)
    const contentLength = response.headers.get('Content-Length')

    if (!contentLength || !response.body) {
      const blob = await response.blob()
      loadState[index].displayUrl = URL.createObjectURL(blob)
      loadState[index].progress = 100
      loadState[index].loaded = true
      return
    }

    const total = parseInt(contentLength, 10)
    let received = 0
    let lastReported = 0
    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      const pct = (received / total) * 100
      if (pct - lastReported >= 1 || pct >= 100) {
        loadState[index].progress = Math.min(pct, 99.9)
        lastReported = pct
      }
    }

    const blob = new Blob(chunks)
    loadState[index].displayUrl = URL.createObjectURL(blob)
    loadState[index].progress = 100
    loadState[index].loaded = true
  } catch {
    loadState[index].displayUrl = photo.thumbUrl
    loadState[index].progress = 100
    loadState[index].loaded = true
  }
}

function openLightbox(index: number) {
  lightboxFullLoaded.value = false
  lightbox.value = index
  loadFullRes(index)
}

function closeLightbox() {
  lightboxAbort?.abort()
  lightboxAbort = null
  if (lightboxFullUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(lightboxFullUrl.value)
  }
  lightbox.value = null
  lightboxFullLoaded.value = false
  lightboxFullUrl.value = ''
  lightboxProgress.value = 0
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  allPhotos.value.forEach((_, i) => loadImage(i))
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  Object.values(loadState).forEach((state) => {
    if (state.displayUrl.startsWith('blob:')) {
      URL.revokeObjectURL(state.displayUrl)
    }
  })
})
</script>

<template>
  <div class="photo-viewer h-full w-full flex flex-col font-lekton text-purple-900 dark:text-sand-100 transition-colors duration-500">
    <!-- Empty state -->
    <div v-if="totalCount === 0" class="flex-1 flex items-center justify-center mt-4">
      <span class="text-[11px] tracking-widest text-studio-500 dark:text-studio-400">NO PHOTOS FOUND</span>
    </div>

    <!-- Grouped Grid -->
    <div v-else class="photo-scroll flex-1 overflow-auto p-4 pt-4">
      <div v-for="group in groupedPhotos" :key="group.folderKey" class="mb-6 last:mb-0">
        <!-- Section header -->
        <div class="flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-studio-500 dark:text-studio-400 mb-3">
          <span class="text-bright-600 dark:text-bright-400">[</span>
          {{ group.group.toUpperCase() }} :: {{ group.photos.length }} {{ group.photos.length === 1 ? 'FILE' : 'FILES' }}
          <span class="text-bright-600 dark:text-bright-400">]</span>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(photo, j) in group.photos"
            :key="photo.filename"
            class="photo-cell relative aspect-[3/2] rounded overflow-hidden cursor-pointer group"
            @click="openLightbox(groupStartIndex.get(group.folderKey)! + j)"
          >
            <!-- Loading overlay -->
            <Transition name="loading-fade">
              <div
                v-if="!loadState[groupStartIndex.get(group.folderKey)! + j]?.loaded"
                class="absolute inset-0 z-10 flex items-center justify-center photo-loading-bg"
              >
                <div class="relative w-3/4 max-w-xs px-4 font-lekton">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] tracking-widest text-studio-400">Loading {{ photo.caption }}...</span>
                    <span class="text-[10px] tracking-widest text-studio-500 tabular-nums">{{ Math.round(loadState[groupStartIndex.get(group.folderKey)! + j]?.progress ?? 0) }}%</span>
                  </div>
                  <div class="h-1 w-full rounded-full bg-studio-900/60 overflow-hidden border border-accent/20">
                    <div
                      class="h-full rounded-full bg-primary transition-none"
                      :style="{ width: (loadState[groupStartIndex.get(group.folderKey)! + j]?.progress ?? 0) + '%' }"
                    >
                      <div
                        v-if="(loadState[groupStartIndex.get(group.folderKey)! + j]?.progress ?? 0) > 0 && (loadState[groupStartIndex.get(group.folderKey)! + j]?.progress ?? 0) < 100"
                        class="h-full w-1.5 float-right rounded-full bg-purple-300 shadow-[0_0_6px_2px_rgba(187,119,255,0.3)]"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Image (thumbnail in grid) -->
            <img
              v-if="loadState[groupStartIndex.get(group.folderKey)! + j]?.displayUrl"
              :src="loadState[groupStartIndex.get(group.folderKey)! + j].displayUrl"
              :alt="photo.caption"
              class="w-full h-full object-cover"
            />

            <!-- Hover overlay with caption -->
            <div
              v-if="loadState[groupStartIndex.get(group.folderKey)! + j]?.loaded"
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            >
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div class="absolute bottom-2 left-2">
                <span class="text-[10px] tracking-wider text-purple-200 bg-studio-1050/80 px-2 py-1 rounded-sm">
                  <span class="text-bright-400">&gt;</span> {{ photo.caption }}
                </span>
              </div>
            </div>

            <!-- Corner accents -->
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30 dark:border-bright-400/30 rounded-tl pointer-events-none"></div>
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30 dark:border-bright-400/30 rounded-br pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox (shows full-res original) -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightbox !== null"
          class="fixed inset-0 z-[9999] flex items-center justify-center"
          @click.self="closeLightbox"
        >
          <div class="absolute inset-0 bg-black/90 backdrop-blur-lg backdrop-saturate-[0.3]" @click="closeLightbox"></div>
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 z-[10001] w-10 h-10 rounded cursor-pointer transition-colors"
            style="background-color: rgba(102, 51, 153, 0.8); color: #ffffff; border: 2px solid rgba(187, 119, 255, 0.6);"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-5 h-5 m-auto">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <div class="lightbox-image relative rounded shadow-neon overflow-hidden" @click.stop>
            <!-- Blurred thumbnail placeholder — in flow, sizes the container -->
            <img
              v-if="loadState[lightbox]?.displayUrl"
              :src="loadState[lightbox].displayUrl"
              :alt="allPhotos[lightbox].caption"
              class="block max-w-[90vw] max-h-[85vh]"
              :class="lightboxFullLoaded ? '' : 'scale-[1.02]'"
              :style="!lightboxFullLoaded ? { filter: `blur(${64 - (lightboxProgress / 100) * 56}px) saturate(${0.4 + (lightboxProgress / 100) * 0.6})` } : undefined"
            />
            <!-- Full-res image absolute on top -->
            <img
              v-if="lightboxFullUrl"
              :src="lightboxFullUrl"
              :alt="allPhotos[lightbox].caption"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              :class="lightboxFullLoaded ? 'opacity-100' : 'opacity-0'"
            />
            <!-- Loading progress bar -->
            <Transition name="loading-fade">
              <div v-if="!lightboxFullLoaded" class="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-8 bg-gradient-to-t from-black/60 to-transparent">
                <div class="flex items-center justify-between mb-1.5 font-lekton">
                  <span class="text-[10px] tracking-widest text-studio-300">LOADING FULL RES...</span>
                  <span class="text-[10px] tracking-widest text-studio-400 tabular-nums">{{ Math.round(lightboxProgress) }}%</span>
                </div>
                <div class="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-primary transition-none"
                    :style="{ width: lightboxProgress + '%' }"
                  >
                    <div
                      v-if="lightboxProgress > 0 && lightboxProgress < 100"
                      class="h-full w-1.5 float-right rounded-full bg-purple-300 shadow-[0_0_6px_2px_rgba(187,119,255,0.3)]"
                    ></div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
          <div
            class="lightbox-caption absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-2 text-sm font-lekton tracking-[0.15em] text-studio-200 text-center whitespace-nowrap"
          >
            {{ allPhotos[lightbox].caption }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.photo-loading-bg {
  background: #08050d;
}

body[data-theme="light"] .photo-loading-bg,
:root[data-theme="light"] .photo-loading-bg {
  background: #f7f5fd;
}

.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}
.loading-fade-leave-to {
  opacity: 0;
}

.photo-scroll {
  will-change: transform;            /* own compositing layer, isolates from parent backdrop-blur */
}

.photo-cell {
  border: 1px solid rgba(102, 51, 153, 0.25);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  content-visibility: auto;          /* skip rendering off-screen cells */
  contain-intrinsic-size: auto 300px 200px; /* placeholder size while off-screen */
  contain: layout style paint;       /* CSS containment */
}

.photo-cell:hover {
  border-color: rgba(187, 119, 255, 0.5);
  box-shadow: 0 0 8px 1px rgba(187, 119, 255, 0.12);
}

.lightbox-caption {
  background: linear-gradient(90deg, transparent 0%, rgba(102, 51, 153, 0.5) 20%, rgba(102, 51, 153, 0.5) 80%, transparent 100%);
}

/* Lightbox transitions */
.lightbox-enter-active {
  transition: opacity 0.25s ease;
}
.lightbox-leave-active {
  transition: opacity 0.15s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* Image fade-in with slight delay so backdrop appears first */
.lightbox-enter-active .lightbox-image {
  transition: opacity 0.3s ease 0.15s;
}
.lightbox-leave-active .lightbox-image {
  transition: opacity 0.1s ease;
}
.lightbox-enter-from .lightbox-image {
  opacity: 0;
}
</style>
