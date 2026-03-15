<script setup lang="ts">
import { useThemeStore } from './stores/themeStore'
import { onMounted, onUnmounted, ref, watch, computed, nextTick } from 'vue'
import { HEXAGON_VERTEX, HEXAGON_VERTEX_DARK } from './helpers/shaders/hexagons'
import { useResizeObserver } from '@vueuse/core'
import { useHead } from '@unhead/vue'

import CyberWindow from './components/os/CyberWindow.vue'
import CyberTaskbar from './components/os/CyberTaskbar.vue'
import MobileShell from './components/os/MobileShell.vue'
import BootSequence from './components/os/BootSequence.vue'
import LoadingBar from './components/os/LoadingBar.vue'
import ScanlineOverlay from './components/effects/ScanlineOverlay.vue'
import GlitchText from './components/effects/GlitchText.vue'

import ProfileApp from './components/apps/ProfileApp.vue'
import SkillMatrixApp from './components/apps/SkillMatrixApp.vue'
import CareerLogApp from './components/apps/CareerLogApp.vue'
import ProjectsApp from './components/apps/ProjectsApp.vue'
import PhotoViewerApp from './components/apps/PhotoViewerApp.vue'
import PongApp from './components/apps/PongApp.vue'

import { useWindowStore } from './stores/windowStore'
import { useMobileDetect } from './composables/useMobileDetect'

const themeStore = useThemeStore()
const windowStore = useWindowStore()
const { isMobile } = useMobileDetect()

const canvas = ref<HTMLCanvasElement | null>(null)
const currentYear = new Date().getFullYear()
const yearHex = computed(() => '0x' + currentYear.toString(16).toUpperCase())

const desktopReady = ref(false)
const loadingComplete = ref(false)

useHead({
  title: 'Alexander Xie | Personal Resume Website',
  meta: [
    {
      name: 'description',
      content: () =>
        "Welcome to my professional portfolio. I'm Alexander Xie, a dedicated Full Stack Engineer with a knack for transforming ideas into scalable web applications.",
    },
  ],
})

onMounted(() => {
  if (canvas.value !== null)
    useResizeObserver(canvas.value, () => {
      //@ts-ignore
      canvas.value?.setSize(1, 1)
    })

  windowStore.layoutWindows()
  window.addEventListener('resize', () => windowStore.rescaleWindows())

  // Easter egg console output
  console.log(
    '%c ██╗  ██╗███████╗██╗  ██╗ ██████╗ ██████╗ ██████╗ ███████╗\n' +
    ' ██║  ██║██╔════╝╚██╗██╔╝██╔════╝██╔═══██╗██╔══██╗██╔════╝\n' +
    ' ███████║█████╗   ╚███╔╝ ██║     ██║   ██║██████╔╝█████╗  \n' +
    ' ██╔══██║██╔══╝   ██╔██╗ ██║     ██║   ██║██╔══██╗██╔══╝  \n' +
    ' ██║  ██║███████╗██╔╝ ██╗╚██████╗╚██████╔╝██║  ██║███████╗\n' +
    ' ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝',
    'color: #bb77ff; font-size: 10px; font-family: monospace;'
  )
  console.log(
    '%c[HEXCORE OS v2.0.26] %cKernel loaded. All systems nominal.',
    'color: #2dd4bf; font-weight: bold;',
    'color: #a78bfa;'
  )
  console.log(
    '%c> %cINTRUDER DETECTED... %cjust kidding. Welcome, curious one.',
    'color: #ef4444;',
    'color: #ef4444; font-weight: bold;',
    'color: #a78bfa; font-style: italic;'
  )
  console.log(
    '%c[WARN] %cUnauthorized access to this console may result in mass hexagon deployment.',
    'color: #f59e0b; font-weight: bold;',
    'color: #d4d4d8;'
  )
  console.log(
    '%c> %cBuilt by Alexander Xie — https://github.com/sorrer',
    'color: #2dd4bf;',
    'color: #a78bfa;'
  )
})

const shaderCode = ref<string>(HEXAGON_VERTEX_DARK)

watch(
  () => themeStore.theme,
  () => {
    shaderCode.value = themeStore.theme === 'dark' ? HEXAGON_VERTEX_DARK : HEXAGON_VERTEX
  },
)

const bootRef = ref<InstanceType<typeof BootSequence> | null>(null)
const loadingRef = ref<InstanceType<typeof LoadingBar> | null>(null)

async function onBootComplete() {
  desktopReady.value = true
  if (isMobile.value) {
    // Skip loading sequence on mobile — mark complete immediately
    loadingComplete.value = true
  } else {
    await nextTick()
    loadingRef.value?.run()
  }
}

function onLoadingComplete() {
  loadingComplete.value = true
}

// When switching from mobile → desktop, ensure windows are open without loading animation
watch(isMobile, (mobile, wasMobile) => {
  if (!mobile && wasMobile && desktopReady.value) {
    const layoutWindows = ['skills', 'experience', 'profile']
    for (const id of layoutWindows) {
      const win = windowStore.windows[id]
      if (!win.isOpen) {
        win.isOpen = true
        win.isLoading = false
        win.loadingProgress = 0
      }
    }
    windowStore.focusWindow('profile')
    loadingComplete.value = true
  }
})

function onRestart() {
  desktopReady.value = false
  loadingComplete.value = false
  windowStore.resetAllWindows()
  uptime.value = 0
  bootRef.value?.restart()
}

// Uptime tracking
const uptime = ref(0)
let uptimeInterval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  uptimeInterval = setInterval(() => {
    uptime.value++
  }, 1000)
})

const formattedUptime = computed(() => {
  const h = Math.floor(uptime.value / 3600)
  const m = Math.floor((uptime.value % 3600) / 60)
  const s = uptime.value % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
})

// Konami code: up up down down left right left right b a
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
let konamiIndex = 0
const konamiTriggered = ref(false)
const konamiGlitch = ref(false)
const konamiFalling = ref(false)
const konamiDistort = ref(false)

const konamiMessages = [
  'WHAT HAVE YOU DONE',
  'THIS WASN\'T SUPPOSED TO HAPPEN',
  'SYSTEM INTEGRITY COMPROMISED',
  'WHY WOULD YOU DO THIS',
  'UNAUTHORIZED ACCESS DETECTED',
  'HEXCORE HAS ENCOUNTERED AN ERROR',
  'REALITY.DLL NOT FOUND',
  'PLEASE STOP TOUCHING THINGS',
  'ALERT: KONAMI BREACH',
  'EXISTENCE IS PAIN',
  'THE MATRIX HAS YOU',
  'HELP',
  '01001000 01000101 01001100 01010000',
  'ERROR 0xDEAD',
  'ABORT RETRY FAIL?',
  'YOUR WARRANTY IS VOID',
]

interface FallingText {
  id: number
  text: string
  x: number
  y: number
  speed: number
  opacity: number
  size: number
  rotation: number
}

const fallingTexts = ref<FallingText[]>([])
let fallingId = 0
let fallingInterval: ReturnType<typeof setInterval> | null = null
let fallingAnimId = 0

function triggerKonami() {
  if (konamiTriggered.value) return
  konamiTriggered.value = true

  // Rapid multi-pulse glitch
  konamiGlitch.value = true
  konamiDistort.value = true
  setTimeout(() => {
    konamiGlitch.value = false
    setTimeout(() => {
      konamiGlitch.value = true
      setTimeout(() => {
        konamiGlitch.value = false
        setTimeout(() => {
          konamiGlitch.value = true
          setTimeout(() => {
            konamiGlitch.value = false
          }, 80)
        }, 100)
      }, 100)
    }, 150)
  }, 150)

  konamiFalling.value = true
  spawnFallingText()
  fallingInterval = setInterval(spawnFallingText, 300)
  animateFalling()
}

function spawnFallingText() {
  const text = konamiMessages[Math.floor(Math.random() * konamiMessages.length)]
  fallingTexts.value.push({
    id: fallingId++,
    text,
    x: 5 + Math.random() * 80,
    y: -5,
    speed: 0.3 + Math.random() * 0.6,
    opacity: 0.5 + Math.random() * 0.5,
    size: 9 + Math.floor(Math.random() * 6),
    rotation: (Math.random() - 0.5) * 30,
  })
  fallingTexts.value = fallingTexts.value.filter(t => t.y < 110)
}

function animateFalling() {
  for (const t of fallingTexts.value) {
    t.y += t.speed
  }
  if (konamiFalling.value) {
    fallingAnimId = requestAnimationFrame(animateFalling)
  }
}

function dismissKonami() {
  konamiFalling.value = false
  konamiDistort.value = false
  konamiTriggered.value = false
  fallingTexts.value = []
  konamiIndex = 0
  if (fallingInterval) {
    clearInterval(fallingInterval)
    fallingInterval = null
  }
  cancelAnimationFrame(fallingAnimId)
}

function onKonamiKeyDown(e: KeyboardEvent) {
  if (e.key === KONAMI[konamiIndex]) {
    konamiIndex++
    if (konamiIndex === KONAMI.length) {
      triggerKonami()
      konamiIndex = 0
    }
  } else {
    konamiIndex = e.key === KONAMI[0] ? 1 : 0
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKonamiKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKonamiKeyDown)
  cancelAnimationFrame(fallingAnimId)
  if (fallingInterval) clearInterval(fallingInterval)
})

// Random hex strings that change slowly
const hexStrings = ref(['A7F3', 'E0C2'])
onMounted(() => {
  setInterval(() => {
    hexStrings.value = hexStrings.value.map(
      () =>
        Math.floor(Math.random() * 0xffff)
          .toString(16)
          .toUpperCase()
          .padStart(4, '0'),
    )
  }, 4000)
})
</script>

<template>
  <div
    class="h-screen w-screen overflow-hidden relative"
    :class="[themeStore.theme === 'dark' ? 'dark' : '', konamiDistort ? 'konami-distort' : '']"
    :data-theme="themeStore.theme === 'dark' ? 'dark' : ''"
  >
    <!-- Konami: Full-screen glitch flash -->
    <Transition name="glitch-flash">
      <div v-if="konamiGlitch" class="konami-glitch-overlay" />
    </Transition>

    <!-- Konami: Falling text overlay -->
    <div v-if="konamiFalling" class="fixed inset-0 z-[9999] pointer-events-none overflow-hidden font-lekton">
      <div
        v-for="t in fallingTexts"
        :key="t.id"
        class="absolute whitespace-nowrap tracking-widest konami-fall-text"
        :style="{
          left: t.x + '%',
          top: t.y + '%',
          opacity: t.opacity,
          fontSize: t.size + 'px',
          transform: 'rotate(' + t.rotation + 'deg)',
        }"
      >
        {{ t.text }}
      </div>

      <!-- Dismiss button -->
      <button
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] pointer-events-auto px-6 py-2 text-xs tracking-widest transition-all duration-200 cursor-pointer font-lekton"
        style="border: 1px solid rgba(248, 113, 113, 0.5); color: #f87171; background: rgba(8, 5, 13, 0.9); text-shadow: 0 0 6px rgba(248, 113, 113, 0.4);"
        @click="dismissKonami"
      >
        [ CLOSE THIS ]
      </button>
    </div>

    <!-- Block all mouse interactions during boot + loading (desktop only) -->
    <div v-if="!loadingComplete && !isMobile" class="fixed inset-0 z-[9998]" />

    <!-- Boot Sequence -->
    <BootSequence ref="bootRef" @complete="onBootComplete" />

    <!-- Wallpaper: solid background -->
    <div
      class="fixed bg-studio-50 dark:bg-studio-1050 w-full h-full -z-50 transition-colors duration-500"
    ></div>

    <!-- Wallpaper: shader -->
    <div class="h-full -z-40 absolute w-full opacity-[0.06] dark:opacity-[0.2]" :class="isMobile ? 'saturate-0 blur-sm' : ''">
      <gl-canvas v-if="shaderCode" @update="() => {}" ref="canvas">
        <gl-program name="main" :code="shaderCode"> </gl-program>
      </gl-canvas>
    </div>

    <!-- Loading Bar (after boot, before desktop — desktop only) -->
    <LoadingBar v-if="!isMobile" ref="loadingRef" @complete="onLoadingComplete" />

    <!-- Scanline Overlay -->
    <ScanlineOverlay />

    <!-- Side Floating Text (desktop only) -->
    <template v-if="!isMobile">
      <div
        class="fixed rotate top-96 -left-1 lg:left-1 z-[500] text-primary dark:text-accent text-xs font-lekton transition-colors duration-500 pointer-events-none"
      >
        <GlitchText text="Alexander Xie @ Software Engineer" />
      </div>
      <div
        class="fixed counter-rotate bottom-32 -right-1 lg:right-1 z-[500] text-primary dark:text-accent text-xs font-lekton transition-colors duration-500 pointer-events-none"
      >
        <GlitchText :text="'-- ' + yearHex + ' --'" />
      </div>

      <!-- Additional Floating Data Elements -->
      <div
        class="fixed top-3 right-4 z-[500] text-primary/20 dark:text-accent/15 text-[10px] font-lekton pointer-events-none tracking-widest"
      >
        SYS_LOAD: 0.42
      </div>
      <div
        class="fixed top-8 right-4 z-[500] text-primary/20 dark:text-accent/15 text-[10px] font-lekton pointer-events-none tracking-widest"
      >
        UPTIME: {{ formattedUptime }}
      </div>
      <div
        class="fixed bottom-16 left-4 z-[500] text-primary/10 dark:text-accent/8 text-[10px] font-lekton pointer-events-none tracking-widest"
      >
        0x{{ hexStrings[0] }}::{{ hexStrings[1] }}
      </div>
    </template>

    <!-- Desktop Area -->
    <template v-if="!isMobile">
      <div v-show="desktopReady" class="w-full h-full pb-12 relative">
        <CyberWindow
          v-for="win in windowStore.windowList"
          :key="win.id"
          :window-id="win.id"
        >
          <ProfileApp v-if="win.id === 'profile'" />
          <SkillMatrixApp v-if="win.id === 'skills'" />
          <CareerLogApp v-if="win.id === 'experience'" />
          <ProjectsApp v-if="win.id === 'projects'" />
          <PhotoViewerApp v-if="win.id === 'photos'" />
          <PongApp v-if="win.id === 'pong'" />
        </CyberWindow>
      </div>

      <!-- Taskbar -->
      <CyberTaskbar @restart="onRestart" :class="!loadingComplete ? 'blur-sm transition-[filter] duration-500' : 'transition-[filter] duration-500'" />
    </template>

    <!-- Mobile Shell -->
    <MobileShell v-else v-show="desktopReady" />
  </div>
</template>

<style lang="scss">
.rotate {
  transform: translateX(-50%) translateY(-50%) rotate(-90deg);
  user-select: none;
}

.counter-rotate {
  -webkit-transform-origin: 50% 50%;
  transform: translateX(50%) translateY(-50%) rotate(90deg);
  user-select: none;
}

/* Scrollbar - defaults to dark theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #190f27;
}

::-webkit-scrollbar-thumb {
  background: #663399;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bb77ff;
}

/* Light theme scrollbar */
body[data-theme='light'] ::-webkit-scrollbar-track {
  background: #e4ddf7;
}

body[data-theme='light'] ::-webkit-scrollbar-thumb {
  background: #9c79d9;
  border-radius: 4px;
}

body[data-theme='light'] ::-webkit-scrollbar-thumb:hover {
  background: #8c5bcc;
}

body {
  background: #180f26;
  transition: background-color 0.5s ease;
  overflow: hidden;
}

/* Konami: continuous page distortion while active */
.konami-distort {
  animation: konami-page-distort 0.3s steps(2) infinite;
}

@keyframes konami-page-distort {
  0% {
    transform: translate(0, 0) skew(0deg, 0deg);
    filter: hue-rotate(0deg) saturate(1.2) brightness(1);
  }
  10% {
    transform: translate(-3px, 1px) skew(0.4deg, -0.2deg);
    filter: hue-rotate(15deg) saturate(1.6) brightness(1.1);
  }
  20% {
    transform: translate(2px, -2px) skew(-0.6deg, 0.3deg);
    filter: hue-rotate(-20deg) saturate(1.8) brightness(0.9);
  }
  30% {
    transform: translate(0, 3px) skew(0.2deg, 0.5deg);
    filter: hue-rotate(30deg) saturate(1.4) brightness(1.15);
  }
  40% {
    transform: translate(-4px, -1px) skew(-0.3deg, -0.4deg);
    filter: hue-rotate(-10deg) saturate(2) brightness(0.85);
  }
  50% {
    transform: translate(3px, 2px) skew(0.5deg, 0.1deg);
    filter: hue-rotate(25deg) saturate(1.3) brightness(1.05);
  }
  60% {
    transform: translate(-1px, -3px) skew(-0.4deg, 0.6deg);
    filter: hue-rotate(-30deg) saturate(1.7) brightness(0.95);
  }
  70% {
    transform: translate(4px, 0) skew(0.3deg, -0.5deg);
    filter: hue-rotate(10deg) saturate(2.2) brightness(1.2);
  }
  80% {
    transform: translate(-2px, 2px) skew(-0.5deg, 0.2deg);
    filter: hue-rotate(-15deg) saturate(1.5) brightness(0.9);
  }
  90% {
    transform: translate(1px, -1px) skew(0.6deg, -0.3deg);
    filter: hue-rotate(20deg) saturate(1.9) brightness(1.1);
  }
  100% {
    transform: translate(0, 0) skew(0deg, 0deg);
    filter: hue-rotate(0deg) saturate(1.2) brightness(1);
  }
}

/* Konami full-screen glitch flash overlay */
.konami-glitch-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
  animation: konami-glitch 0.15s steps(4) forwards;
}

.konami-glitch-overlay::before,
.konami-glitch-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
}

.konami-glitch-overlay::before {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(248, 113, 113, 0.06) 2px,
    rgba(248, 113, 113, 0.06) 4px
  );
  animation: konami-scanline-scroll 0.1s linear infinite;
}

.konami-glitch-overlay::after {
  background: rgba(34, 211, 238, 0.08);
  mix-blend-mode: screen;
  animation: konami-color-split 0.12s steps(3) infinite;
}

@keyframes konami-scanline-scroll {
  from { transform: translateY(0); }
  to { transform: translateY(4px); }
}

@keyframes konami-color-split {
  0% { transform: translate(-3px, 0); background: rgba(248, 113, 113, 0.12); }
  33% { transform: translate(3px, 1px); background: rgba(34, 211, 238, 0.1); }
  66% { transform: translate(-1px, -1px); background: rgba(187, 119, 255, 0.12); }
  100% { transform: translate(2px, 0); background: rgba(248, 113, 113, 0.08); }
}

@keyframes konami-glitch {
  0% {
    background: rgba(248, 113, 113, 0.2);
    transform: translate(0) scaleY(1);
    clip-path: inset(0 0 80% 0);
  }
  15% {
    background: rgba(34, 211, 238, 0.15);
    transform: translate(-6px, 3px) skewX(2deg) scaleY(1.01);
    clip-path: inset(10% 0 30% 0);
  }
  30% {
    background: rgba(187, 119, 255, 0.25);
    transform: translate(5px, -2px) skewX(-1.5deg) scaleY(0.99);
    clip-path: inset(40% 0 10% 0);
  }
  45% {
    background: rgba(248, 113, 113, 0.15);
    transform: translate(-3px, 5px) skewX(1deg);
    clip-path: inset(20% 0 40% 0);
  }
  60% {
    background: rgba(34, 211, 238, 0.2);
    transform: translate(8px, -3px) skewX(-2deg) scaleY(1.02);
    clip-path: inset(5% 0 60% 0);
  }
  75% {
    background: rgba(187, 119, 255, 0.18);
    transform: translate(-4px, 1px) skewX(0.8deg);
    clip-path: inset(50% 0 5% 0);
  }
  90% {
    background: rgba(248, 113, 113, 0.1);
    transform: translate(2px, -4px) skewX(-0.5deg);
    clip-path: inset(0);
  }
  100% {
    background: rgba(187, 119, 255, 0.08);
    transform: translate(0);
    clip-path: inset(0);
  }
}

.glitch-flash-enter-active {
  animation: konami-glitch 0.15s steps(4);
}
.glitch-flash-leave-active {
  animation: konami-glitch-out 0.08s ease-out;
}

@keyframes konami-glitch-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Falling text */
.konami-fall-text {
  color: #f87171;
  text-shadow: 0 0 12px rgba(248, 113, 113, 0.6), 0 0 4px rgba(248, 113, 113, 0.4);
}

.konami-fall-text:nth-child(odd) {
  color: #bb77ff;
  text-shadow: 0 0 12px rgba(187, 119, 255, 0.6), 0 0 4px rgba(187, 119, 255, 0.4);
}

.konami-fall-text:nth-child(3n) {
  color: #22d3ee;
  text-shadow: 0 0 12px rgba(34, 211, 238, 0.6), 0 0 4px rgba(34, 211, 238, 0.4);
}
</style>
