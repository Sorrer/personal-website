<script setup lang="ts">
import HexGridPanel from '../skills/HexGridPanel.vue'
import TerminalScanPanel from '../skills/TerminalScanPanel.vue'
import { techSkills, generalSkills } from '../skills/hexSkillData'
</script>

<template>
  <div class="h-full w-full p-4 flex flex-col gap-4 font-lekton text-purple-900 dark:text-sand-100 transition-colors duration-500 overflow-auto">
    <div class="flex flex-col gap-3 flex-1 min-h-0">
      <div class="flex-1 min-h-[280px] border border-accent/25 rounded bg-studio-50/50 dark:bg-studio-1000/40 overflow-hidden relative transition-colors duration-500">
        <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-bright-700/40 dark:border-bright-500/40" />
        <HexGridPanel title="Technologies" :skills="techSkills" :cols="5" command-module="tech" :start-delay="0" />
      </div>
      <div class="flex-1 min-h-[280px] border border-accent/25 rounded bg-studio-50/50 dark:bg-studio-1000/40 overflow-hidden relative transition-colors duration-500">
        <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-bright-700/40 dark:border-bright-500/40" />
        <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-bright-700/40 dark:border-bright-500/40" />
        <TerminalScanPanel title="Skills" :skills="generalSkills" command-module="skills" :start-delay="1800" />
      </div>
    </div>
  </div>
</template>
