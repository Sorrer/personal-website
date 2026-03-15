<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  interval?: number
}>(), {
  interval: 5000,
})

const isGlitching = ref(false)
let glitchInterval: ReturnType<typeof setInterval> | null = null

function triggerGlitch() {
  isGlitching.value = true
  setTimeout(() => {
    isGlitching.value = false
  }, 150 + Math.random() * 100)
}

onMounted(() => {
  function scheduleGlitch() {
    const delay = props.interval + Math.random() * (props.interval * 0.6)
    glitchInterval = setTimeout(() => {
      triggerGlitch()
      scheduleGlitch()
    }, delay)
  }
  scheduleGlitch()
})

onUnmounted(() => {
  if (glitchInterval) clearTimeout(glitchInterval)
})
</script>

<template>
  <span class="glitch-text" :class="{ 'glitch-text--active': isGlitching }" :data-text="text">{{ text }}</span>
</template>

<style>
.glitch-text {
  position: relative;
  display: inline-block;
}

.glitch-text--active {
  animation: glitch-skew 0.15s ease-in-out;
}

.glitch-text--active::before,
.glitch-text--active::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.glitch-text--active::before {
  color: #34e4ea;
  animation: glitch-before 0.15s linear;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text--active::after {
  color: #bb77ff;
  animation: glitch-after 0.15s linear;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

/* Light theme: deeper glitch colors for contrast */
:root:not(.dark) .glitch-text--active::before {
  color: #1f898c;
}

:root:not(.dark) .glitch-text--active::after {
  color: #8c5bcc;
}

@keyframes glitch-before {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, 0); }
  80% { transform: translate(1px, 1px); }
  100% { transform: translate(0); }
}

@keyframes glitch-after {
  0% { transform: translate(0); }
  20% { transform: translate(2px, -1px); }
  40% { transform: translate(-2px, 1px); }
  60% { transform: translate(1px, 0); }
  80% { transform: translate(-1px, -1px); }
  100% { transform: translate(0); }
}

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  25% { transform: skew(0.5deg); }
  50% { transform: skew(-0.3deg); }
  75% { transform: skew(0.2deg); }
  100% { transform: skew(0deg); }
}
</style>
