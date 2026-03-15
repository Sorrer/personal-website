<script setup lang="ts">
import { useThemeStore } from './stores/themeStore'
import { onMounted, ref, watch, computed, nextTick } from 'vue'
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
    :class="themeStore.theme === 'dark' ? 'dark' : ''"
    :data-theme="themeStore.theme === 'dark' ? 'dark' : ''"
  >
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
      <gl-canvas @update="() => {}" ref="canvas">
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
</style>
