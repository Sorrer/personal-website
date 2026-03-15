<script setup lang="ts">
import { ref, computed } from 'vue'
import { projects, getCareerForProject } from '@/data/careerData'

const activeIndex = ref(0)
const activeProject = computed(() => projects[activeIndex.value])
const activeCareer = computed(() => getCareerForProject(activeProject.value))

function prev() {
  if (activeIndex.value > 0) activeIndex.value--
}

function next() {
  if (activeIndex.value < projects.length - 1) activeIndex.value++
}
</script>

<template>
  <div class="h-full w-full flex flex-col font-lekton text-purple-900 dark:text-sand-100 transition-colors duration-500">
    <p class="text-bright-700 dark:text-bright-500 text-[10px] tracking-widest opacity-70 px-4 pt-3 flex-shrink-0">&gt; LOADING: Project Archive</p>

    <div class="flex-1 min-h-0 p-4 pt-2">
      <div class="h-full border border-accent/25 rounded bg-studio-50/50 dark:bg-studio-1000/40 relative overflow-hidden">
        <!-- Corner brackets -->
        <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-bright-700/40 dark:border-bright-500/40" />

        <div class="p-4 h-full overflow-auto">
          <Transition name="project-swap" mode="out-in">
            <div :key="activeIndex" class="flex flex-col gap-2">
              <!-- Header -->
              <div class="flex items-baseline gap-3 flex-wrap">
                <h1 class="text-lg font-bold text-primary leading-tight">{{ activeProject.name }}</h1>
                <span v-if="activeCareer" class="text-[11px] tracking-[0.15em] text-bright-700 dark:text-bright-500/80">
                  {{ activeCareer.title }}
                </span>
                <span v-if="activeProject.founder" class="text-[9px] tracking-widest text-bright-700 dark:text-bright-500/60 border border-bright-700/30 dark:border-bright-500/30 px-1.5 py-0.5 rounded">FOUNDER</span>
              </div>

              <div class="flex items-center gap-3 flex-wrap">
                <h2 v-if="activeCareer" class="text-sm font-bold text-studio-700 dark:text-studio-400">{{ activeCareer.role }}</h2>
                <span v-if="activeCareer" class="text-[10px] tracking-widest text-studio-500">[{{ activeCareer.timestamp }}] → [{{ activeCareer.end }}]</span>
              </div>

              <!-- Summary -->
              <p class="mt-1 text-sm leading-relaxed text-studio-800 dark:text-studio-300">
                {{ activeProject.summary }}
              </p>

              <!-- Contributions -->
              <div class="mt-2">
                <p class="text-[10px] tracking-widest text-bright-700 dark:text-bright-500/60 mb-1.5">CONTRIBUTIONS</p>
                <ul class="flex flex-col gap-1">
                  <li
                    v-for="(item, i) in activeProject.contributions"
                    :key="i"
                    class="text-xs text-studio-700 dark:text-studio-300/80 flex gap-2"
                  >
                    <span class="text-accent shrink-0">▸</span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- Tags -->
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in activeProject.tags"
                  :key="tag"
                  class="px-2 py-0.5 text-[10px] tracking-wider rounded border border-accent/30 text-studio-600 dark:text-studio-400 bg-studio-100/50 dark:bg-studio-950/50"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Link -->
              <a
                v-if="activeProject.url"
                :href="activeProject.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-flex items-center gap-1.5 text-xs text-bright-700 dark:text-bright-500 hover:underline opacity-80 hover:opacity-100 transition-opacity"
              >
                <span>&#x2197;</span>
                <span>{{ activeProject.url }}</span>
              </a>
            </div>
          </Transition>
        </div>

        <!-- Nav footer -->
        <div v-if="projects.length > 1" class="absolute bottom-2 right-3 flex items-center gap-3 text-[11px] tracking-widest text-studio-500 select-none">
          <button
            @click.stop="prev"
            :disabled="activeIndex === 0"
            class="hover:text-bright-700 dark:hover:text-bright-500 disabled:opacity-20 transition-colors duration-200 cursor-pointer disabled:cursor-default"
          >◀</button>
          <span class="tabular-nums">{{ String(activeIndex + 1).padStart(2, '0') }}/{{ String(projects.length).padStart(2, '0') }}</span>
          <button
            @click.stop="next"
            :disabled="activeIndex === projects.length - 1"
            class="hover:text-bright-700 dark:hover:text-bright-500 disabled:opacity-20 transition-colors duration-200 cursor-pointer disabled:cursor-default"
          >▶</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-swap-enter-active,
.project-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.project-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.project-swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
