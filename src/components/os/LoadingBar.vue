<script setup lang="ts">
import { useWindowStore } from '../../stores/windowStore'

const emit = defineEmits<{
  complete: []
}>()

const windowStore = useWindowStore()

// Load order: sides first, profile last so it ends up focused
const loadSteps = [
  { id: 'skills', label: 'STATS SCANNER' },
  { id: 'experience', label: 'CAREER LOG' },
  { id: 'profile', label: 'PROFILE' },
]

// All layout windows — opened immediately with loading overlay
const allWindows = ['skills', 'experience', 'profile']

function animateProgress(id: string, from: number, to: number, duration: number): Promise<void> {
  return new Promise((resolve) => {
    const startTime = performance.now()
    function tick() {
      const elapsed = performance.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - t) * (1 - t)
      windowStore.setLoadingProgress(id, from + (to - from) * eased)
      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  // Open all windows immediately with loading overlay
  for (const id of allWindows) {
    windowStore.setLoading(id, true)
    windowStore.setLoadingProgress(id, 0)
    windowStore.openWindow(id)
  }

  await delay(300)

  // Sequentially load each one
  for (let i = 0; i < loadSteps.length; i++) {
    const step = loadSteps[i]

    // Focus the window being loaded so it's the active panel
    windowStore.focusWindow(step.id)

    // Animate progress 0 → 100 on this window
    await animateProgress(step.id, 0, 100, 800)

    // Small pause at 100% before clearing
    await delay(150)

    // Done loading — reveal content
    windowStore.setLoading(step.id, false)

    // Wait before starting next window
    if (i < loadSteps.length - 1) {
      await delay(250)
    }
  }

  emit('complete')
}

defineExpose({ run })
</script>

<template>
  <!-- Headless component — loading UI is rendered per-window inside CyberWindow -->
</template>
