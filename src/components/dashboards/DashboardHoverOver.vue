<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { careerEntries as entries } from '@/data/careerData'
import GlitchText from '@/components/effects/GlitchText.vue'

const activeIndex = ref(entries.length - 1)
const activeEntry = computed(() => entries[activeIndex.value])

const container = ref<HTMLElement | null>(null)
const isCompact = ref(false)
const COMPACT_THRESHOLD = 420

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (container.value) {
    resizeObserver = new ResizeObserver(([entry]) => {
      isCompact.value = entry.contentRect.width < COMPACT_THRESHOLD
    })
    resizeObserver.observe(container.value)
    isCompact.value = container.value.offsetWidth < COMPACT_THRESHOLD
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

function selectEntry(index: number) {
  activeIndex.value = index
}

function prev() {
  if (activeIndex.value > 0) activeIndex.value--
}

function next() {
  if (activeIndex.value < entries.length - 1) activeIndex.value++
}
</script>

<template>
  <div ref="container" class="flex flex-col w-full h-full relative overflow-hidden font-lekton">

    <!-- === WIDE LAYOUT: horizontal timeline + detail panel === -->
    <template v-if="!isCompact">
      <!-- Timeline -->
      <div class="flex-shrink-0 px-8 pt-4 pb-5">
        <div class="flex items-center justify-around">
          <div
            v-for="(entry, i) in entries"
            :key="i"
            class="flex flex-col items-center cursor-pointer group relative"
            @click="selectEntry(i)"
          >
            <span
              class="text-[11px] tracking-widest mb-3 transition-all duration-300 select-none"
              :class="i === activeIndex ? 'text-studio-800 dark:text-studio-300 font-bold' : 'text-studio-600 dark:text-studio-400 opacity-65 group-hover:opacity-90'"
            >
              {{ entry.timestamp }}
            </span>

            <div class="relative flex items-center justify-center">
              <div
                class="w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10"
                :class="i === activeIndex
                  ? 'border-bright-700 bg-bright-700 dark:border-bright-500 dark:bg-bright-500 shadow-[0_0_10px_3px_rgba(42,182,187,0.25)] dark:shadow-[0_0_10px_3px_rgba(52,228,234,0.35)]'
                  : 'border-accent/50 bg-studio-100 dark:bg-studio-950 group-hover:border-primary'"
              />
              <div
                v-if="i === activeIndex"
                class="absolute w-6 h-6 rounded-full border border-bright-700/20 dark:border-bright-500/20 node-pulse"
              />
            </div>

            <span
              class="text-xs tracking-wider mt-3 transition-all duration-300 whitespace-nowrap select-none"
              :class="i === activeIndex ? 'text-primary font-bold' : 'text-studio-600 dark:text-studio-400 opacity-65 group-hover:opacity-90'"
            >
              <GlitchText v-if="entry.id === 'next'" :text="entry.title" />
              <template v-else>{{ entry.title }}</template>
            </span>
          </div>
        </div>
      </div>

      <!-- Detail Panel -->
      <div class="flex-1 min-h-0 px-4 pb-3">
        <div class="detail-panel h-full border border-accent/25 rounded bg-studio-50/50 dark:bg-studio-1000/40 relative overflow-hidden">
          <!-- Corner brackets -->
          <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-bright-700/40 dark:border-bright-500/40" />
          <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-bright-700/40 dark:border-bright-500/40" />
          <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-bright-700/40 dark:border-bright-500/40" />
          <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-bright-700/40 dark:border-bright-500/40" />

          <div class="p-4 h-full overflow-auto">
            <Transition name="entry-swap" mode="out-in">
              <div :key="activeIndex" class="flex flex-col gap-1.5">
                <div class="flex items-baseline gap-3 flex-wrap">
                  <h1 class="text-lg font-bold text-primary leading-tight">
                    <GlitchText v-if="activeEntry.id === 'next'" :text="activeEntry.title" />
                    <template v-else>{{ activeEntry.title }}</template>
                  </h1>
                  <span class="text-[11px] tracking-[0.15em] text-bright-700 dark:text-bright-500/80">
                    [{{ activeEntry.timestamp }}] → [{{ activeEntry.end.toUpperCase() }}]
                  </span>
                </div>
                <h2 class="text-sm font-bold text-studio-700 dark:text-studio-400">{{ activeEntry.role }}</h2>
                <p class="mt-1 text-sm leading-relaxed text-studio-800 dark:text-studio-300">
                  {{ activeEntry.summary }}
                </p>
              </div>
            </Transition>
          </div>

          <!-- Nav footer -->
          <div class="absolute bottom-2 right-3 flex items-center gap-3 text-[11px] tracking-widest text-studio-500 dark:text-studio-500 select-none">
            <button
              @click.stop="prev"
              :disabled="activeIndex === 0"
              class="hover:text-bright-700 dark:hover:text-bright-500 disabled:opacity-20 transition-colors duration-200 cursor-pointer disabled:cursor-default"
            >◀</button>
            <span class="tabular-nums">{{ String(activeIndex + 1).padStart(2, '0') }}/{{ String(entries.length).padStart(2, '0') }}</span>
            <button
              @click.stop="next"
              :disabled="activeIndex === entries.length - 1"
              class="hover:text-bright-700 dark:hover:text-bright-500 disabled:opacity-20 transition-colors duration-200 cursor-pointer disabled:cursor-default"
            >▶</button>
          </div>
        </div>
      </div>
    </template>

    <!-- === COMPACT LAYOUT: stacked scrollable list === -->
    <template v-else>
      <div class="flex-1 min-h-0 overflow-auto px-4 py-3 flex flex-col gap-3">
        <div
          v-for="(entry, i) in entries"
          :key="i"
          class="border rounded p-4 cursor-pointer transition-all duration-300 relative"
          :class="i === activeIndex
            ? 'border-bright-700/40 dark:border-bright-500/40 bg-studio-50/50 dark:bg-studio-1000/40'
            : 'border-accent/20 bg-studio-50/30 dark:bg-studio-1000/20 opacity-70 hover:opacity-90'"
          @click="selectEntry(i)"
        >
          <!-- Corner brackets on active -->
          <template v-if="i === activeIndex">
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-bright-700/40 dark:border-bright-500/40" />
            <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-bright-700/40 dark:border-bright-500/40" />
            <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-bright-700/40 dark:border-bright-500/40" />
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-bright-700/40 dark:border-bright-500/40" />
          </template>

          <!-- Timeline info -->
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-2.5 h-2.5 rounded-full border-2 shrink-0 transition-all duration-300"
              :class="i === activeIndex
                ? 'border-bright-700 bg-bright-700 dark:border-bright-500 dark:bg-bright-500 shadow-[0_0_6px_2px_rgba(42,182,187,0.25)] dark:shadow-[0_0_6px_2px_rgba(52,228,234,0.35)]'
                : 'border-accent/50 bg-studio-100 dark:bg-studio-950'"
            />
            <span class="text-[11px] tracking-widest text-studio-600 dark:text-studio-400">
              {{ entry.timestamp }}
            </span>
            <span class="text-[11px] tracking-[0.15em] text-bright-700 dark:text-bright-500/80">
              → [{{ entry.end.toUpperCase() }}]
            </span>
          </div>

          <!-- Title & role -->
          <h1
            class="text-base font-bold leading-tight transition-colors duration-300"
            :class="i === activeIndex ? 'text-primary' : 'text-studio-700 dark:text-studio-400'"
          >
            <GlitchText v-if="entry.id === 'next'" :text="entry.title" />
            <template v-else>{{ entry.title }}</template>
          </h1>
          <h2 class="text-sm font-bold text-studio-700 dark:text-studio-400 mt-0.5">{{ entry.role }}</h2>

          <!-- Description (only on active) -->
          <p
            v-if="i === activeIndex"
            class="mt-2 text-sm leading-relaxed text-studio-800 dark:text-studio-300"
          >
            {{ entry.summary }}
          </p>
        </div>
      </div>
    </template>

  </div>
</template>

<style scoped>
.entry-swap-enter-active,
.entry-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.entry-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.entry-swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes node-glow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.4);
  }
}

.node-pulse {
  animation: node-glow 2.5s ease-in-out infinite;
}
</style>
