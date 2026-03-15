<script setup lang="ts">
import DashBoardHoverOver from '../dashboards/DashboardHoverOver.vue'
</script>

<template>
  <div class="h-full w-full flex flex-col font-lekton text-purple-900 dark:text-sand-100 transition-colors duration-500">
    <p class="text-bright-700 dark:text-bright-500 text-[10px] tracking-widest opacity-70 px-4 pt-3 flex-shrink-0">&gt; READING: Career Log Entries</p>
    <div class="flex-1 min-h-0">
      <DashBoardHoverOver />
    </div>
  </div>
</template>
