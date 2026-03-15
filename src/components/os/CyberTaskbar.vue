<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowStore } from '../../stores/windowStore'
import { useThemeStore } from '../../stores/themeStore'
import IconHexagon from '../../assets/icons/IconHexagon.vue'
import IconLightBulb from '../../assets/icons/IconLightBulb.vue'

const emit = defineEmits<{
  restart: []
}>()

const windowStore = useWindowStore()
const themeStore = useThemeStore()

const clock = ref('00:00:00')
let clockInterval: ReturnType<typeof setInterval> | null = null

const startMenuOpen = ref(false)

function toggleStartMenu() {
  startMenuOpen.value = !startMenuOpen.value
}

function closeStartMenu() {
  startMenuOpen.value = false
}

function handleStartMenuApp(id: string) {
  const win = windowStore.windows[id]
  if (!win.isOpen) {
    windowStore.openWindow(id)
  } else if (win.isMinimized) {
    windowStore.restoreWindow(id)
  } else {
    windowStore.focusWindow(id)
  }
  closeStartMenu()
}

function handleRestart() {
  closeStartMenu()
  emit('restart')
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.start-menu') && !target.closest('.start-button')) {
    closeStartMenu()
  }
}

function updateClock() {
  const now = new Date()
  clock.value = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(n => String(n).padStart(2, '0'))
    .join(':')
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  document.addEventListener('mousedown', onClickOutside)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
  document.removeEventListener('mousedown', onClickOutside)
})

function handleAppClick(id: string) {
  const win = windowStore.windows[id]
  if (!win.isOpen) {
    windowStore.openWindow(id)
  } else if (win.isMinimized) {
    windowStore.restoreWindow(id)
  } else {
    windowStore.focusWindow(id)
  }
}
</script>

<template>
  <div class="cyber-taskbar fixed bottom-0 left-0 right-0 z-[1000] flex items-center h-12 md:h-12 px-2 select-none">

    <!-- Start Menu Popup -->
    <Transition name="start-menu">
      <div
        v-if="startMenuOpen"
        class="start-menu absolute bottom-12 left-1 z-[1001] w-56 rounded-t border border-b-0 font-lekton overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-2 border-b border-primary/15">
          <p class="text-[10px] tracking-[0.2em] text-bright-500/70">HEXCORE OS</p>
          <p class="text-xs text-studio-300 mt-0.5">v2.0.26</p>
        </div>

        <!-- App List -->
        <div class="py-1">
          <button
            v-for="win in windowStore.windowList"
            :key="win.id"
            @click="handleStartMenuApp(win.id)"
            class="w-full text-left px-4 py-2 text-xs tracking-wide flex items-center gap-3 transition-colors duration-150 cursor-pointer"
            :class="win.isOpen && win.isFocused
              ? 'text-primary bg-purple-800/30'
              : 'text-studio-500 hover:bg-purple-800/20 hover:text-studio-300'"
          >
            <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="[
              win.isOpen && win.isFocused ? 'bg-bright-400' : win.isOpen && !win.isMinimized ? 'bg-primary/40' : 'bg-studio-700'
            ]"></span>
            <span>{{ win.title }}</span>
            <span v-if="!win.isOpen" class="ml-auto text-[9px] text-studio-700">CLOSED</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="h-px bg-primary/15 mx-3"></div>

        <!-- System Actions -->
        <div class="py-1">
          <button
            @click="handleRestart"
            class="w-full text-left px-4 py-2 text-xs tracking-wide flex items-center gap-3 text-studio-500 hover:bg-purple-800/20 hover:text-studio-300 transition-colors duration-150 cursor-pointer"
          >
            <span class="text-[10px]">&#x21BB;</span>
            <span>Restart System</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Start Button -->
    <div class="flex items-center mr-2">
      <div
        class="start-button w-9 h-9 flex items-center justify-center cursor-pointer rounded transition-colors group"
        :class="startMenuOpen ? 'bg-purple-800/50' : 'hover:bg-purple-800/40'"
        @click="toggleStartMenu"
      >
        <IconHexagon class="w-6 h-6 fill-primary stroke-primary transition-colors" :class="startMenuOpen ? 'fill-bright-400 stroke-bright-400' : 'group-hover:fill-bright-400 group-hover:stroke-bright-400'" />
      </div>
      <div class="w-px h-6 bg-studio-700/50 ml-2"></div>
    </div>

    <!-- App Buttons -->
    <div class="flex items-center gap-1 flex-1 overflow-x-auto">
      <button
        v-for="win in windowStore.windowList"
        :key="win.id"
        @click="handleAppClick(win.id)"
        class="taskbar-app-btn flex items-center gap-2 px-3 h-8 rounded text-xs font-lekton tracking-wide transition-all duration-200 whitespace-nowrap shrink-0"
        :class="[
          win.isOpen && win.isFocused
            ? 'bg-purple-800/40 text-primary'
            : 'text-studio-500 hover:bg-studio-900/30 hover:text-studio-400'
        ]"
      >
        <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="[
          win.isOpen && win.isFocused ? 'bg-bright-400' : win.isOpen && !win.isMinimized ? 'bg-primary/40' : 'bg-studio-700'
        ]"></span>
        <span>{{ win.title }}</span>
      </button>
    </div>

    <!-- System Tray -->
    <div class="flex items-center gap-3 ml-2">
      <div class="w-px h-6 bg-studio-700/50"></div>

      <!-- Theme Toggle -->
      <button
        @click="themeStore.toggleTheme()"
        class="w-7 h-7 flex items-center justify-center rounded hover:bg-studio-800/60 transition-colors cursor-pointer"
        :class="themeStore.theme === 'light' ? 'ring-1 ring-bright-500/50' : ''"
        :title="themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <IconLightBulb class="w-4 h-4 stroke-studio-400 hover:stroke-studio-200 transition-colors" :class="themeStore.theme === 'light' ? 'stroke-bright-400' : ''" />
      </button>

      <!-- Connection Status -->
      <div class="flex items-center gap-1.5" title="System Online">
        <span class="w-1.5 h-1.5 rounded-full bg-bright-400 animate-pulse"></span>
      </div>

      <!-- Clock -->
      <div class="font-lekton text-xs text-studio-300 tracking-widest tabular-nums min-w-[60px] text-right">
        {{ clock }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cyber-taskbar {
  background: linear-gradient(180deg, rgba(15, 9, 24, 0.92) 0%, rgba(8, 5, 13, 0.96) 100%);
  border-top: 1px solid rgba(187, 119, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

body[data-theme="light"] .cyber-taskbar {
  background: linear-gradient(180deg, rgba(228, 221, 247, 0.92) 0%, rgba(240, 237, 250, 0.96) 100%);
  border-top: 1px solid rgba(102, 51, 153, 0.2);
}

body[data-theme="light"] .cyber-taskbar .taskbar-app-btn {
  color: #56337f;
}

body[data-theme="light"] .cyber-taskbar .taskbar-app-btn:hover {
  background: rgba(140, 91, 204, 0.12);
  color: #362055;
}

body[data-theme="light"] .cyber-taskbar .font-lekton {
  color: #56337f;
}

body[data-theme="light"] .cyber-taskbar .bg-bright-400 {
  background-color: #1f898c;
}

body[data-theme="light"] .cyber-taskbar .stroke-studio-400 {
  stroke: #7d4bb9;
}

body[data-theme="light"] .cyber-taskbar .hover\:bg-studio-800\/60:hover {
  background: rgba(140, 91, 204, 0.15);
}

body[data-theme="light"] .cyber-taskbar .bg-purple-800\/50 {
  background: rgba(140, 91, 204, 0.2);
}

body[data-theme="light"] .cyber-taskbar .hover\:bg-purple-800\/40:hover {
  background: rgba(140, 91, 204, 0.15);
}

body[data-theme="light"] .cyber-taskbar .bg-studio-700\/50 {
  background: rgba(102, 51, 153, 0.2);
}

.shadow-neon-sm {
  box-shadow: 0 0 6px 1px rgba(187, 119, 255, 0.15);
}

.start-menu {
  background: rgba(8, 5, 13, 0.96);
  border-color: rgba(187, 119, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

body[data-theme="light"] .start-menu {
  background: rgba(240, 237, 250, 0.96);
  border-color: rgba(102, 51, 153, 0.25);
}

body[data-theme="light"] .start-menu button {
  color: #56337f;
}

body[data-theme="light"] .start-menu button:hover {
  background: rgba(140, 91, 204, 0.15);
}

body[data-theme="light"] .start-menu .bg-bright-400 {
  background-color: #1f898c;
}

body[data-theme="light"] .start-menu .text-bright-500\/70 {
  color: #1f898c;
}

body[data-theme="light"] .start-menu .text-studio-200 {
  color: #56337f;
}

body[data-theme="light"] .start-menu .text-studio-300 {
  color: #7d4bb9;
}

body[data-theme="light"] .start-menu .text-studio-400 {
  color: #9c79d9;
}

.start-menu-enter-active {
  animation: startMenuOpen 0.15s ease-out;
}
.start-menu-leave-active {
  animation: startMenuClose 0.1s ease-in;
}

@keyframes startMenuOpen {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes startMenuClose {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
