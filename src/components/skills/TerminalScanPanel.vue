<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import type { HexSkill } from './hexSkillData'

const props = withDefaults(defineProps<{
  title: string
  skills: HexSkill[]
  commandModule: string
  startDelay?: number
}>(), {
  startDelay: 0,
})

const CYCLE_MS = 4000
const TYPING_SPEED = 40
const SIG_FLICKER_COUNT = 4
const SIG_FLICKER_MS = 50
const LOAD_DRIFT_MS = 2000

const command = computed(() => `root@hexcore:~$ scan --module=${props.commandModule}`)
const typedLength = ref(0)
const typingDone = ref(false)
const revealedRows = ref(0)
const activeIndex = ref(0)
const flickeringSig = ref<Map<number, string>>(new Map())
let cycleTimer: ReturnType<typeof setInterval> | null = null
let loadDriftTimer: ReturnType<typeof setInterval> | null = null
const scrollContainer = ref<HTMLElement | null>(null)

// Animated load values — drift randomly around base
const animatedLoads = ref<number[]>([])

function initLoads() {
  animatedLoads.value = props.skills.map(s => s.load)
}

function driftLoads() {
  animatedLoads.value = props.skills.map(s => {
    const drift = Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0
    return Math.max(1, Math.min(5, s.load + drift))
  })
}

// Generate stable random hex signatures
const signatures = computed(() =>
  props.skills.map(() => randomHex())
)

const activeSkill = computed(() => props.skills[activeIndex.value])

function randomHex(): string {
  return '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
}

function getBlocks(load: number): string {
  const filled = Math.min(load, 5)
  const empty = 5 - filled
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty)
}

function getSigDisplay(index: number): string {
  return flickeringSig.value.get(index) ?? signatures.value[index]
}

// Typing animation
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

// Stagger row reveal
function startReveal() {
  let i = 0
  const interval = setInterval(() => {
    i++
    revealedRows.value = i
    if (i >= props.skills.length) {
      clearInterval(interval)
      startCycle()
      // Start load bar drift
      loadDriftTimer = setInterval(driftLoads, LOAD_DRIFT_MS)
    }
  }, 60)
}

// Cursor cycling
function startCycle() {
  flickerSig(activeIndex.value)
  cycleTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.skills.length
    flickerSig(activeIndex.value)
  }, CYCLE_MS)
}

function flickerSig(index: number) {
  let count = 0
  const interval = setInterval(() => {
    flickeringSig.value.set(index, randomHex())
    count++
    if (count >= SIG_FLICKER_COUNT) {
      clearInterval(interval)
      flickeringSig.value.delete(index)
    }
  }, SIG_FLICKER_MS)
}

function selectRow(index: number) {
  activeIndex.value = index
  if (cycleTimer) clearInterval(cycleTimer)
  flickerSig(index)
  cycleTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.skills.length
    flickerSig(activeIndex.value)
  }, CYCLE_MS)
}

function onVisibilityChange() {
  if (document.hidden) {
    if (cycleTimer) clearInterval(cycleTimer)
    cycleTimer = null
  } else if (typingDone.value && revealedRows.value >= props.skills.length) {
    if (cycleTimer) clearInterval(cycleTimer)
    cycleTimer = setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % props.skills.length
      flickerSig(activeIndex.value)
    }, CYCLE_MS)
  }
}

// Smooth scroll active row toward center of the container
watch(activeIndex, async () => {
  await nextTick()
  const el = scrollContainer.value
  if (!el) return
  const row = el.querySelector('.scan-row-active') as HTMLElement | null
  if (!row) return

  const containerH = el.clientHeight
  const rowTop = row.offsetTop
  const rowH = row.offsetHeight
  // Target: center the row vertically
  const targetScroll = rowTop - containerH / 2 + rowH / 2
  el.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' })
})

onMounted(() => {
  initLoads()
  if (props.startDelay > 0) {
    setTimeout(() => startTyping(), props.startDelay)
  } else {
    startTyping()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (cycleTimer) clearInterval(cycleTimer)
  if (loadDriftTimer) clearInterval(loadDriftTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div class="terminal-scan w-full h-full flex flex-col font-lekton text-[11px] tracking-wider select-none overflow-hidden">
    <!-- Command prompt -->
    <div class="px-3 pt-3 pb-0">
      <span class="text-bright-700 dark:text-bright-500">{{ command.slice(0, typedLength) }}</span>
      <span
        v-if="!typingDone"
        class="cursor-blink text-bright-700 dark:text-bright-500"
      >_</span>
    </div>

    <!-- Active process display -->
    <div
      v-if="typingDone"
      class="px-3 py-1 text-bright-700 dark:text-bright-500 text-[12px] tracking-[0.15em] transition-all duration-300 active-process-label"
    >
      &gt; {{ activeSkill?.name?.toUpperCase() }}
    </div>

    <!-- Column headers -->
    <div
      v-if="typingDone"
      class="scan-header grid px-3 py-1 text-studio-500 dark:text-studio-400 border-b border-studio-300 dark:border-studio-800 opacity-60"
    >
      <span>PROCESS</span>
      <span>SIG</span>
    </div>

    <!-- Skill rows -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto overflow-x-hidden terminal-scrollbar px-1"
    >
      <template v-for="(skill, i) in skills" :key="skill.id">
        <div
          v-if="i < revealedRows"
          class="scan-row grid px-2 py-[3px] rounded-sm transition-all duration-300 cursor-pointer"
          :class="i === activeIndex ? 'scan-row-active' : 'scan-row-idle'"
          @click="selectRow(i)"
        >
          <span class="truncate">{{ i === activeIndex ? '> ' : '' }}{{ skill.name }}</span>
          <span class="tabular-nums opacity-70">{{ getSigDisplay(i) }}</span>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <div
      v-if="revealedRows >= skills.length"
      class="px-3 py-2 text-[10px] text-studio-600 dark:text-studio-600 border-t border-studio-300 dark:border-studio-800 opacity-60"
    >
      SCAN COMPLETE: {{ skills.length }} modules loaded
    </div>
  </div>
</template>

<style scoped>
.scan-header,
.scan-row {
  grid-template-columns: 1fr 64px;
  gap: 4px;
  align-items: center;
}

.scan-row-active {
  color: #34e4ea;
  text-shadow: 0 0 6px rgba(52, 228, 234, 0.3);
  background: linear-gradient(90deg, transparent 0%, rgba(52, 228, 234, 0.08) 30%, rgba(52, 228, 234, 0.08) 70%, transparent 100%);
}

.scan-row-idle {
  color: #9c79d9;
}

/* Dark mode override for idle rows */
:root.dark .scan-row-idle,
.dark .scan-row-idle {
  color: #7d4bb9;
}

/* Light mode overrides */
:root:not(.dark) .scan-row-active {
  color: #1f898c;
  text-shadow: 0 0 4px rgba(42, 182, 187, 0.2);
  background: linear-gradient(90deg, transparent 0%, rgba(42, 182, 187, 0.1) 30%, rgba(42, 182, 187, 0.1) 70%, transparent 100%);
}

:root:not(.dark) .scan-row-idle {
  color: #56337f;
}

:root:not(.dark) .active-process-label {
  text-shadow: none;
}

.cursor-blink {
  animation: blink 0.6s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.terminal-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #56337f transparent;
}
.terminal-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.terminal-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.terminal-scrollbar::-webkit-scrollbar-thumb {
  background: #56337f;
  border-radius: 2px;
}
.terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #7d4bb9;
}

/* Light mode scrollbar */
:root:not(.dark) .terminal-scrollbar {
  scrollbar-color: #9c79d9 transparent;
}
:root:not(.dark) .terminal-scrollbar::-webkit-scrollbar-thumb {
  background: #9c79d9;
}
:root:not(.dark) .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #8c5bcc;
}
</style>
