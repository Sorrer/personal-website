<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/themeStore'
import IconLightBulb from '../../assets/icons/IconLightBulb.vue'
import GlitchText from '../effects/GlitchText.vue'

defineProps<{
  activeTab: string
  showBack?: boolean
  appLabel?: string
}>()

const emit = defineEmits<{
  'open-menu': []
  back: []
}>()

const themeStore = useThemeStore()

const clock = ref('00:00')
let clockInterval: ReturnType<typeof setInterval> | null = null

function updateClock() {
  const now = new Date()
  clock.value = [now.getHours(), now.getMinutes()]
    .map(n => String(n).padStart(2, '0'))
    .join(':')
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

const sectionLabels: Record<string, string> = {
  profile: 'PROFILE',
  skills: 'SKILL_MATRIX',
  career: 'CAREER_LOG',
}
</script>

<template>
  <div class="mobile-header fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between h-11 px-3 select-none">
    <!-- Left side -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- Back button (app mode) -->
      <button
        v-if="showBack"
        @click="emit('back')"
        class="font-lekton text-[11px] tracking-wider text-accent dark:text-primary cursor-pointer hover:opacity-80 transition-opacity"
      >
        &larr; BACK
      </button>

      <!-- Menu dots button (normal mode) -->
      <button
        v-else
        @click="emit('open-menu')"
        class="w-7 h-7 flex items-center justify-center rounded hover:bg-studio-800/60 transition-colors cursor-pointer"
        title="More apps"
      >
        <svg width="4" height="16" viewBox="0 0 4 16" fill="none" class="text-studio-400">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          <circle cx="2" cy="8" r="1.5" fill="currentColor" />
          <circle cx="2" cy="14" r="1.5" fill="currentColor" />
        </svg>
      </button>

      <!-- Branding (normal mode only) -->
      <div v-if="!showBack" class="font-lekton text-xs text-accent dark:text-primary tracking-wider transition-colors duration-500">
        <GlitchText text="HEXCORE //" />
      </div>
    </div>

    <!-- Center: Active section or app label -->
    <div class="font-lekton text-[11px] text-studio-600 dark:text-studio-500 tracking-[0.2em] uppercase transition-colors duration-500">
      {{ showBack ? appLabel : (sectionLabels[activeTab] || '') }}
    </div>

    <!-- Right: Controls -->
    <div class="flex items-center gap-2.5 shrink-0">
      <!-- Theme Toggle -->
      <button
        @click="themeStore.toggleTheme()"
        class="w-7 h-7 flex items-center justify-center rounded hover:bg-studio-800/60 transition-colors cursor-pointer"
        :class="themeStore.theme === 'light' ? 'ring-1 ring-bright-500/50' : ''"
      >
        <IconLightBulb class="w-4 h-4 stroke-studio-400 hover:stroke-studio-200 transition-colors" :class="themeStore.theme === 'light' ? 'stroke-bright-400' : ''" />
      </button>

      <!-- Connection Status -->
      <span class="w-1.5 h-1.5 rounded-full bg-bright-700 dark:bg-bright-400 animate-pulse"></span>

      <!-- Clock -->
      <div class="font-lekton text-[11px] text-studio-700 dark:text-studio-500 tracking-widest tabular-nums transition-colors duration-500">
        {{ clock }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mobile-header {
  background: linear-gradient(180deg, rgba(8, 5, 13, 0.96) 0%, rgba(15, 9, 24, 0.92) 100%);
  border-bottom: 1px solid rgba(187, 119, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding-top: env(safe-area-inset-top);
}

body[data-theme="light"] .mobile-header {
  background: linear-gradient(180deg, rgba(240, 237, 250, 0.96) 0%, rgba(228, 221, 247, 0.92) 100%);
  border-bottom: 1px solid rgba(102, 51, 153, 0.2);
}

body[data-theme="light"] .mobile-header .stroke-studio-400 {
  stroke: #7d4bb9;
}

body[data-theme="light"] .mobile-header .hover\:bg-studio-800\/60:hover {
  background: rgba(140, 91, 204, 0.15);
}
</style>
