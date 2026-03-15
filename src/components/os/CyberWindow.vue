<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowStore } from '../../stores/windowStore'
import GlitchText from '../effects/GlitchText.vue'

const props = defineProps<{
  windowId: string
}>()

const windowStore = useWindowStore()
const win = computed(() => windowStore.windows[props.windowId])

const isClosing = ref(false)
const isVisible = ref(true)

function handleClose() {
  isClosing.value = true
  setTimeout(() => {
    isClosing.value = false
    isVisible.value = false
    windowStore.closeWindow(props.windowId)
  }, 350)
}

// Re-show when window is reopened
import { watchEffect } from 'vue'
watchEffect(() => {
  if (win.value.isOpen) {
    isVisible.value = true
  }
})

const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const isResizing = ref(false)
const resizeStart = ref({ x: 0, y: 0, w: 0, h: 0 })

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 975
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Drag handlers
function onTitleMouseDown(e: MouseEvent) {
  if (isMobile.value || win.value.isMaximized) return
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - win.value.position.x,
    y: e.clientY - win.value.position.y,
  }
  windowStore.focusWindow(props.windowId)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onTitleTouchStart(e: TouchEvent) {
  if (isMobile.value || win.value.isMaximized) return
  const touch = e.touches[0]
  isDragging.value = true
  dragOffset.value = {
    x: touch.clientX - win.value.position.x,
    y: touch.clientY - win.value.position.y,
  }
  windowStore.focusWindow(props.windowId)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  windowStore.updatePosition(
    props.windowId,
    e.clientX - dragOffset.value.x,
    e.clientY - dragOffset.value.y,
  )
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  e.preventDefault()
  const touch = e.touches[0]
  windowStore.updatePosition(
    props.windowId,
    touch.clientX - dragOffset.value.x,
    touch.clientY - dragOffset.value.y,
  )
}

function onMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onTouchEnd() {
  isDragging.value = false
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
}

// Resize handlers
function onResizeMouseDown(e: MouseEvent) {
  if (isMobile.value || win.value.isMaximized) return
  e.stopPropagation()
  isResizing.value = true
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    w: win.value.size.width,
    h: win.value.size.height,
  }
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeUp)
}

function onResizeMove(e: MouseEvent) {
  if (!isResizing.value) return
  const newW = Math.max(300, resizeStart.value.w + (e.clientX - resizeStart.value.x))
  const newH = Math.max(200, resizeStart.value.h + (e.clientY - resizeStart.value.y))
  windowStore.updateSize(props.windowId, newW, newH)
}

function onResizeUp() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeUp)
}

// Each window gets a unique blink speed based on its id
const statusDotSpeed = computed(() => {
  const hash = parseInt(props.windowId, 36) % 5
  return [1.8, 2.4, 3.1, 2.0, 2.7][hash] + 's'
})

const fakePid = computed(() => Math.floor(1000 + parseInt(props.windowId, 36) % 9000))

const memoryBase = parseInt(props.windowId, 36) % 64 + 12
const fakeMemory = ref(memoryBase + 'MB')
let memInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const drift = () => {
    const delta = Math.floor(Math.random() * 5) - 2
    const val = Math.max(8, memoryBase + delta)
    fakeMemory.value = val + 'MB'
  }
  // Each window fluctuates at a slightly different rate
  const rate = 2000 + (parseInt(props.windowId, 36) % 3) * 800
  memInterval = setInterval(drift, rate)
})

onUnmounted(() => {
  if (memInterval) clearInterval(memInterval)
})

const windowStyle = computed(() => {
  if (isMobile.value || win.value.isMaximized) {
    return {
      position: 'fixed' as const,
      left: '0px',
      top: '0px',
      width: '100vw',
      height: isMobile.value ? 'calc(100vh - 56px)' : 'calc(100vh - 48px)',
      zIndex: win.value.zIndex,
    }
  }
  return {
    position: 'absolute' as const,
    left: win.value.position.x + 'px',
    top: win.value.position.y + 'px',
    width: win.value.size.width + 'px',
    height: win.value.size.height + 'px',
    zIndex: win.value.zIndex,
  }
})
</script>

<template>

    <div
      v-if="isVisible && win.isOpen"
      v-show="!win.isMinimized"
      class="cyber-window flex flex-col"
      :class="[
        win.isFocused ? 'cyber-window--focused' : 'cyber-window--unfocused',
        isDragging ? 'cyber-window--dragging' : '',
        isClosing ? 'cyber-window--glitch-close' : '',
      ]"
      :style="windowStyle"
      @mousedown="windowStore.focusWindow(windowId)"
    >
      <!-- Title Bar -->
      <div
        class="cyber-window__titlebar flex items-center justify-between px-3 h-8 min-h-[32px] select-none shrink-0"
        :class="isMobile || win.isMaximized ? 'cursor-default' : 'cursor-move'"
        @mousedown="onTitleMouseDown"
        @touchstart="onTitleTouchStart"
      >
        <div class="flex items-center gap-2 overflow-hidden">
          <span class="titlebar-status-dot w-2 h-2 rounded-full bg-bright-700 dark:bg-bright-400 shrink-0" :style="{ animationDuration: statusDotSpeed }"></span>
          <GlitchText :text="win.title" class="text-xs font-lekton tracking-wider text-studio-200 truncate" />
        </div>
        <div class="flex items-center gap-1">
          <button
            v-if="!isMobile"
            @click.stop="windowStore.maximizeWindow(windowId)"
            class="w-5 h-5 flex items-center justify-center text-studio-400 hover:text-primary hover:bg-studio-800 rounded-sm transition-colors"
            :title="win.isMaximized ? 'Restore' : 'Fullscreen'"
          >
            <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <template v-if="!win.isMaximized">
                <!-- Expand arrows -->
                <path d="M1 4V1h3" /><path d="M8 1h3v3" />
                <path d="M11 8v3H8" /><path d="M4 11H1V8" />
              </template>
              <template v-else>
                <!-- Collapse arrows -->
                <path d="M4 1v3H1" /><path d="M11 4H8V1" />
                <path d="M8 11V8h3" /><path d="M1 8h3v3" />
              </template>
            </svg>
          </button>
          <button
            @click.stop="handleClose"
            class="w-5 h-5 flex items-center justify-center text-studio-400 hover:text-purple-300 hover:bg-purple-900/80 rounded-sm transition-colors text-xs"
            title="Close"
          >&#x2715;</button>
        </div>
      </div>

      <!-- Content -->
      <div class="cyber-window__content flex-1 overflow-auto min-h-0 relative">
        <slot />

        <!-- Per-window loading overlay -->
        <Transition name="loading-fade">
          <div v-if="win.isLoading" class="absolute inset-0 z-10 flex items-center justify-center">
            <!-- Blank backdrop — fully opaque to hide content -->
            <div class="absolute inset-0 cyber-window__loading-bg"></div>

            <!-- Loading bar -->
            <div class="relative w-3/4 max-w-xs px-4 font-lekton">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] tracking-widest text-studio-400">Loading {{ win.title }}...</span>
                <span class="text-[10px] tracking-widest text-studio-500 tabular-nums">{{ Math.round(win.loadingProgress) }}%</span>
              </div>
              <div class="h-1 w-full rounded-full bg-studio-900/60 overflow-hidden border border-accent/20">
                <div
                  class="h-full rounded-full bg-primary transition-none"
                  :style="{ width: win.loadingProgress + '%' }"
                >
                  <div
                    v-if="win.loadingProgress > 0 && win.loadingProgress < 100"
                    class="h-full w-1.5 float-right rounded-full bg-purple-300 shadow-[0_0_6px_2px_rgba(187,119,255,0.3)]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Status Bar -->
      <div class="cyber-window__statusbar flex items-center justify-between px-3 h-6 min-h-[24px] shrink-0 select-none">
        <span class="text-[10px] font-lekton text-studio-500 tracking-wide">PID:{{ fakePid }}</span>
        <span class="text-[10px] font-lekton text-studio-500 tracking-wide">MEM:{{ fakeMemory }}</span>
      </div>

      <!-- Resize Handle -->
      <div
        v-if="!isMobile && !win.isMaximized"
        class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10"
        @mousedown="onResizeMouseDown"
      >
        <svg class="w-full h-full text-studio-600 opacity-50 hover:opacity-100 transition-opacity" viewBox="0 0 16 16">
          <path d="M14 14L8 14L14 8Z" fill="currentColor" />
        </svg>
      </div>
    </div>
</template>

<style lang="scss">
.cyber-window {
  border: 1px solid rgba(102, 51, 153, 0.4);
  border-radius: 4px;
  overflow: hidden;
  background: rgba(8, 5, 13, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.3s ease, filter 0.3s ease;

  &--focused {
    border-color: rgba(187, 119, 255, 0.6);
    box-shadow: 0 0 12px 2px rgba(187, 119, 255, 0.15),
                0 0 4px 1px rgba(187, 119, 255, 0.1),
                inset 0 0 30px rgba(187, 119, 255, 0.03);
  }

  &--unfocused {
    border-color: rgba(102, 51, 153, 0.15);
    opacity: 0.75;
    filter: brightness(0.85) blur(1px) saturate(0.08);
    cursor: pointer;

    &:hover {
      opacity: 0.9;
      filter: brightness(0.95) blur(0.3px) saturate(0.5);
    }
  }

  &--dragging {
    transition: none !important;
    user-select: none;
  }

  &__titlebar {
    background: linear-gradient(180deg, rgba(30, 15, 50, 1) 0%, rgba(15, 9, 24, 1) 100%);
    border-bottom: 1px solid rgba(187, 119, 255, 0.15);
  }

  &__content {
    scrollbar-width: thin;
    scrollbar-color: #663399 #08050d;
  }

  &__statusbar {
    background: rgba(15, 9, 24, 1);
    border-top: 1px solid rgba(102, 51, 153, 0.15);
  }
}

// Light theme adjustments
body[data-theme="light"] .cyber-window {
  background: rgba(247, 245, 253, 0.95);
  border-color: rgba(102, 51, 153, 0.3);

  &--focused {
    border-color: rgba(140, 91, 204, 0.5);
    box-shadow: 0 0 12px 2px rgba(140, 91, 204, 0.12),
                0 0 4px 1px rgba(140, 91, 204, 0.08);
  }

  .cyber-window__titlebar {
    background: linear-gradient(180deg, rgba(207, 194, 240, 0.95) 0%, rgba(228, 221, 247, 0.95) 100%);
    border-bottom: 1px solid rgba(102, 51, 153, 0.2);
  }

  .cyber-window__statusbar {
    background: rgba(228, 221, 247, 0.9);
    border-top: 1px solid rgba(102, 51, 153, 0.15);
  }

  .cyber-window__statusbar span {
    color: #56337f;
  }

  .cyber-window__titlebar .text-studio-200 {
    color: #56337f;
  }

  .cyber-window__titlebar .text-studio-400 {
    color: #7d4bb9;
  }

  .cyber-window__titlebar button:hover {
    background: rgba(140, 91, 204, 0.15);
  }

  .cyber-window__content {
    scrollbar-color: #9c79d9 #f0edfa;
  }
}

.titlebar-status-dot {
  opacity: 1;
}

.cyber-window--glitch-close {
  animation: glitch-close 0.35s ease-in forwards;
  pointer-events: none;
}

.cyber-window__loading-bg {
  background: #08050d;
}

body[data-theme="light"] .cyber-window__loading-bg {
  background: #f7f5fd;
}

.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}
.loading-fade-leave-to {
  opacity: 0;
}

@keyframes glitch-close {
  0% {
    opacity: 1;
    transform: scale(1) skew(0deg);
    filter: none;
  }
  10% {
    opacity: 1;
    transform: scale(1) skew(1.5deg, 0.5deg);
    filter: hue-rotate(20deg) brightness(1.3);
    clip-path: inset(0 0 0 0);
  }
  20% {
    opacity: 0.9;
    transform: scale(1.01, 0.97) skew(-2deg, 0deg) translateX(4px);
    filter: hue-rotate(-15deg) saturate(2);
    clip-path: inset(10% 0 5% 0);
  }
  35% {
    opacity: 0.8;
    transform: scale(0.98, 1.02) skew(1deg) translateX(-6px);
    filter: hue-rotate(30deg) brightness(1.5);
    clip-path: inset(0 0 15% 0);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.02, 0.9) skew(-3deg, 1deg) translateX(3px);
    filter: hue-rotate(-25deg) saturate(3) brightness(0.8);
    clip-path: inset(20% 5% 10% 0);
  }
  65% {
    opacity: 0.3;
    transform: scale(0.95, 0.85) skew(2deg) translateX(-2px) translateY(5px);
    filter: hue-rotate(40deg) brightness(1.8) blur(1px);
    clip-path: inset(5% 0 30% 10%);
  }
  80% {
    opacity: 0.15;
    transform: scale(0.9, 0.7) skew(-1deg) translateY(10px);
    filter: brightness(2) blur(2px);
    clip-path: inset(15% 15% 40% 5%);
  }
  100% {
    opacity: 0;
    transform: scale(0.8, 0.3) translateY(15px);
    filter: brightness(3) blur(4px);
    clip-path: inset(50% 25% 50% 25%);
  }
}
</style>
