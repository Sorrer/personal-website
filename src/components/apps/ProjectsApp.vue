<script setup lang="ts">
import { computed } from 'vue'
import { projects, getCareerForProject } from '@/data/careerData'

const projectsWithCareer = computed(() =>
  projects.map(p => {
    const career = getCareerForProject(p)
    const role = p.roleTitle
      ? career?.roles?.find(r => r.title === p.roleTitle)
      : undefined
    return { project: p, career, role }
  })
)
</script>

<template>
  <div class="h-full w-full flex flex-col font-lekton text-purple-900 dark:text-sand-100 transition-colors duration-500">
    <p class="text-bright-700 dark:text-bright-500 text-[10px] tracking-widest opacity-70 px-4 pt-3 flex-shrink-0">&gt; LOADING: Project Archive</p>

    <div class="flex-1 min-h-0 overflow-auto p-4 pt-2 flex flex-col gap-3">
      <div
        v-for="{ project, career, role } in projectsWithCareer"
        :key="project.name"
        class="border border-accent/25 rounded bg-studio-50/50 dark:bg-studio-1000/40 relative p-4 flex-shrink-0"
      >
        <!-- Corner brackets -->
        <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-bright-700/40 dark:border-bright-500/40" />

        <div class="flex flex-col gap-2">
          <!-- Header -->
          <div class="flex items-baseline gap-3 flex-wrap">
            <h1 class="text-lg font-bold text-primary leading-tight">{{ project.name }}</h1>
            <span v-if="career" class="text-[11px] tracking-[0.15em] text-bright-700 dark:text-bright-500/80">
              {{ career.title }}
            </span>
            <span v-if="project.founder" class="text-[9px] tracking-widest text-bright-700 dark:text-bright-500/60 border border-bright-700/30 dark:border-bright-500/30 px-1.5 py-0.5 rounded">FOUNDER</span>
          </div>

          <div v-if="career" class="flex items-center gap-3 flex-wrap">
            <h2 class="text-sm font-bold text-studio-700 dark:text-studio-400">{{ role ? role.title : career.role }}</h2>
            <span class="text-[10px] tracking-widest text-studio-500">[{{ role ? role.start : career.timestamp }}] → [{{ role ? role.end : career.end }}]</span>
          </div>

          <!-- Summary -->
          <p class="mt-1 text-sm leading-relaxed text-studio-800 dark:text-studio-300">
            {{ project.summary }}
          </p>

          <!-- Contributions -->
          <div class="mt-2">
            <p class="text-[10px] tracking-widest text-bright-700 dark:text-bright-500/60 mb-1.5">CONTRIBUTIONS</p>
            <ul class="flex flex-col gap-1">
              <li
                v-for="(item, i) in project.contributions"
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
              v-for="tag in project.tags"
              :key="tag"
              class="px-2 py-0.5 text-[10px] tracking-wider rounded border border-accent/30 text-studio-600 dark:text-studio-400 bg-studio-100/50 dark:bg-studio-950/50"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Link -->
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex items-center gap-1.5 text-xs text-bright-700 dark:text-bright-500 hover:underline opacity-80 hover:opacity-100 transition-opacity"
          >
            <span>&#x2197;</span>
            <span>{{ project.url }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
