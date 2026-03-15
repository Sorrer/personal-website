<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HexNode from './HexNode.vue'
import { type HexSkill, computeHexPositions } from './hexSkillData'

const props = withDefaults(defineProps<{
  title: string
  skills: HexSkill[]
  cols: number
  commandModule?: string
  startDelay?: number
}>(), {
  startDelay: 0,
})

const HEX_W = 46
const HEX_H = 42
const CYCLE_MS = 4000
const TYPING_SPEED = 40

const command = computed(() => `root@hexcore:~$ scan --module=${props.commandModule ?? 'tech'}`)
const typedLength = ref(0)
const typingDone = ref(false)
const revealedNodes = ref(0)

const focusedIndex = ref(0)
let cycleTimer: ReturnType<typeof setInterval> | null = null

const positions = computed(() => {
  const rows = Math.ceil(props.skills.length / props.cols)
  const colSpacing = HEX_W * 0.88
  const rowSpacing = HEX_H * 0.82
  // Center the grid in the SVG viewport
  const gridW = (props.cols - 1) * colSpacing + HEX_W
  const gridH = (rows - 1) * rowSpacing + HEX_H
  const ox = (svgWidth.value - gridW) / 2 + HEX_W / 2
  const oy = (svgHeight.value - gridH) / 2 + HEX_H / 2
  return computeHexPositions(props.skills, props.cols, HEX_W, HEX_H, ox, oy)
})

const svgWidth = computed(() => 400)
const svgHeight = computed(() => 300)

const focusedSkill = computed(() => props.skills[focusedIndex.value])

const connectedIds = computed(() => {
  if (!focusedSkill.value) return new Set<string>()
  return new Set(focusedSkill.value.connections)
})

function getNodeState(skill: HexSkill): 'focused' | 'connected' | 'idle' {
  if (skill.id === focusedSkill.value?.id) return 'focused'
  if (connectedIds.value.has(skill.id)) return 'connected'
  return 'idle'
}

function startTyping() {
  const len = command.value.length
  let i = 0
  const interval = setInterval(() => {
    i++
    typedLength.value = i
    if (i >= len) {
      clearInterval(interval)
      typingDone.value = true
      startReveal()
    }
  }, TYPING_SPEED)
}

function startReveal() {
  let i = 0
  const interval = setInterval(() => {
    i++
    revealedNodes.value = i
    if (i >= props.skills.length) {
      clearInterval(interval)
      startTimer()
    }
  }, 80)
}

function selectSkill(index: number) {
  focusedIndex.value = index
  resetTimer()
}

function startTimer() {
  cycleTimer = setInterval(() => {
    focusedIndex.value = (focusedIndex.value + 1) % props.skills.length
  }, CYCLE_MS)
}

function resetTimer() {
  if (cycleTimer) clearInterval(cycleTimer)
  startTimer()
}

function onVisibilityChange() {
  if (document.hidden) {
    if (cycleTimer) clearInterval(cycleTimer)
    cycleTimer = null
  } else if (typingDone.value) {
    resetTimer()
  }
}

onMounted(() => {
  if (props.startDelay > 0) {
    setTimeout(() => startTyping(), props.startDelay)
  } else {
    startTyping()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (cycleTimer) clearInterval(cycleTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div class="hex-grid-panel w-full h-full flex flex-col items-center select-none overflow-hidden font-lekton">
    <div class="w-full px-3 pt-3 pb-0 text-[11px] tracking-wider">
      <span class="text-bright-700 dark:text-bright-500">{{ command.slice(0, typedLength) }}</span>
      <span v-if="!typingDone" class="cursor-blink text-bright-700 dark:text-bright-500">_</span>
    </div>
    <div
      v-if="typingDone"
      class="w-full px-3 py-1 text-bright-700 dark:text-bright-500 text-[12px] tracking-[0.15em] transition-all duration-300 hex-active-label"
    >
      &gt; {{ focusedSkill?.name?.toUpperCase() }}
    </div>

    <svg
      v-if="typingDone"
      width="100%"
      height="100%"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      preserveAspectRatio="xMidYMid meet"
      class="flex-1 min-h-0"
    >
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neonGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Hex nodes (base layer) -->
      <g
        v-for="(skill, i) in skills"
        :key="skill.id"
        :transform="`translate(${positions[i].x - 23}, ${positions[i].y - 21})`"
        :class="i < revealedNodes ? 'hex-revealed' : 'hex-hidden'"
      >
        <HexNode
          v-if="i < revealedNodes"
          :short-name="skills[i].short"
          :state="getNodeState(skills[i])"
          @select="selectSkill(i)"
        />
      </g>

      <!-- Focused node re-rendered on top so no borders overlap -->
      <g
        v-if="revealedNodes > 0 && positions[focusedIndex]"
        :transform="`translate(${positions[focusedIndex].x - 23}, ${positions[focusedIndex].y - 21})`"
      >
        <HexNode
          :short-name="skills[focusedIndex].short"
          state="focused"
          @select="selectSkill(focusedIndex)"
        />
      </g>
    </svg>

    <p
      v-if="typingDone"
      class="text-bright-700 dark:text-bright-500 font-lekton text-xs tracking-[0.2em] pb-3 h-6 transition-opacity duration-300"
    >
      [ {{ focusedSkill?.name?.toUpperCase() }} ]
    </p>
  </div>
</template>

<style scoped>
.cursor-blink {
  animation: blink 0.6s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hex-hidden {
  opacity: 0;
}

.hex-revealed {
  animation: hex-appear 0.3s ease-out forwards;
}

@keyframes hex-appear {
  from { opacity: 0; }
  to { opacity: 1; }
}

:root:not(.dark) .hex-active-label {
  text-shadow: none;
}
</style>
