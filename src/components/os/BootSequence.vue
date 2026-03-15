<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const isMobile = window.innerWidth < 975

const lines = ref<{ text: string; status?: string; visible: boolean }[]>([])

function buildLines() {
  return [
    { text: 'HEXCORE OS v2.0.26', visible: false },
    { text: 'Initializing system...', visible: false },
    { text: 'Loading kernel modules...', status: 'OK', visible: false },
    { text: 'Mounting /dev/shader0...', status: 'OK', visible: false },
    { text: isMobile ? 'Loading mobile interface...' : 'Loading window manager...', status: 'OK', visible: false },
    { text: 'Loading PROFILE...', status: 'OK', visible: false },
    { text: 'Loading STATS SCANNER...', status: 'OK', visible: false },
    { text: 'Loading CAREER LOG...', status: 'OK', visible: false },
    { text: 'System ready.', visible: false },
    { text: '', visible: false },
    { text: 'Welcome, Alexander Xie', visible: false },
  ]
}

const fadeOut = ref(false)
const hidden = ref(false)

function runSequence() {
  lines.value = buildLines()
  fadeOut.value = false
  hidden.value = false

  const baseDelay = isMobile ? 80 : 120
  const delays: number[] = []
  let cumulative = 0

  lines.value.forEach((_, i) => {
    const jitter = Math.floor(Math.random() * baseDelay * 0.8)
    cumulative += baseDelay + jitter
    delays.push(cumulative)
    setTimeout(() => {
      lines.value[i].visible = true
    }, cumulative)
  })

  const totalTime = (delays[delays.length - 1] ?? 0) + 1500
  setTimeout(() => {
    fadeOut.value = true
    sessionStorage.setItem('hexcore-booted', '1')
    setTimeout(() => {
      hidden.value = true
      emit('complete')
    }, 400)
  }, totalTime)
}

function restart() {
  runSequence()
}

onMounted(() => {
  if (sessionStorage.getItem('hexcore-booted')) {
    hidden.value = true
    emit('complete')
    return
  }
  runSequence()
})

defineExpose({ restart })
</script>

<template>
  <div
    v-if="!hidden"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-studio-1050 transition-opacity duration-500"
    :class="fadeOut ? 'opacity-0' : 'opacity-100'"
  >
    <div class="font-lekton text-sm sm:text-base w-full max-w-lg px-8">
      <template v-for="(line, i) in lines" :key="i">
        <div
          v-if="line.visible"
          class="boot-line mb-1"
          :class="[
            i === 0 ? 'text-primary text-lg sm:text-xl font-bold mb-3' : '',
            i === lines.length - 1 ? 'text-bright-400 mt-2 text-base sm:text-lg' : '',
            i === lines.length - 2 ? 'h-4' : '',
          ]"
        >
          <span class="text-studio-300">{{ line.text }}</span>
          <span v-if="line.status" class="ml-3 text-bright-400">[{{ line.status }}]</span>
        </div>
      </template>
      <span class="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5 align-middle" v-if="!fadeOut"></span>
    </div>
  </div>
</template>

<style>
.boot-line {
  animation: boot-appear 0.1s ease-out;
}

@keyframes boot-appear {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
