<script setup lang="ts">
import IconAvatar from '../../assets/icons/IconAvatar.vue'
import IconHardwareChip from '../../assets/icons/IconHardwareChip.vue'
import IconBarChart from '../../assets/icons/IconBarChart.vue'

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  change: [tabId: string]
}>()

const tabs = [
  { id: 'profile', label: 'PROFILE', icon: IconAvatar },
  { id: 'skills', label: 'SKILLS', icon: IconHardwareChip },
  { id: 'career', label: 'CAREER', icon: IconBarChart },
  { id: 'more', label: 'MORE', icon: null },
] as const

function activeIndex() {
  return tabs.findIndex(t => t.id === props.activeTab)
}
</script>

<template>
  <div class="mobile-navbar fixed bottom-0 left-0 right-0 z-[1000] select-none">
    <div class="flex items-center justify-around h-14 relative">
      <!-- Neon underline indicator -->
      <div
        class="absolute top-0 h-[2px] bg-accent dark:bg-primary transition-all duration-300 ease-out"
        :style="{
          width: (100 / tabs.length) + '%',
          left: (activeIndex() * 100 / tabs.length) + '%'
        }"
      ></div>

      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="emit('change', tab.id)"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors duration-200 cursor-pointer"
        :class="activeTab === tab.id ? 'text-accent dark:text-primary' : 'text-studio-500'"
      >
        <!-- Named icon components -->
        <component
          v-if="tab.icon"
          :is="tab.icon"
          class="w-5 h-5 transition-colors duration-200"
          :class="activeTab === tab.id
            ? 'stroke-accent dark:stroke-primary fill-none'
            : 'stroke-studio-500 fill-none'"
        />
        <!-- Inline grid icon for MORE -->
        <svg
          v-else
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          class="transition-colors duration-200"
        >
          <circle cx="6" cy="6" r="2" :class="activeTab === tab.id ? 'fill-accent dark:fill-primary' : 'fill-studio-500'" />
          <circle cx="14" cy="6" r="2" :class="activeTab === tab.id ? 'fill-accent dark:fill-primary' : 'fill-studio-500'" />
          <circle cx="6" cy="14" r="2" :class="activeTab === tab.id ? 'fill-accent dark:fill-primary' : 'fill-studio-500'" />
          <circle cx="14" cy="14" r="2" :class="activeTab === tab.id ? 'fill-accent dark:fill-primary' : 'fill-studio-500'" />
        </svg>
        <span class="font-lekton text-[10px] tracking-wider">{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.mobile-navbar {
  background: linear-gradient(0deg, rgba(8, 5, 13, 0.96) 0%, rgba(15, 9, 24, 0.92) 100%);
  border-top: 1px solid rgba(187, 119, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding-bottom: env(safe-area-inset-bottom);
}

body[data-theme="light"] .mobile-navbar {
  background: linear-gradient(0deg, rgba(240, 237, 250, 0.96) 0%, rgba(228, 221, 247, 0.92) 100%);
  border-top: 1px solid rgba(102, 51, 153, 0.2);
}

body[data-theme="light"] .mobile-navbar button {
  color: #9c79d9;
}

body[data-theme="light"] .mobile-navbar button.text-primary {
  color: #663399;
}

body[data-theme="light"] .mobile-navbar .stroke-studio-500 {
  stroke: #9c79d9;
}

body[data-theme="light"] .mobile-navbar .stroke-primary {
  stroke: #663399;
}

body[data-theme="light"] .mobile-navbar .fill-studio-500 {
  fill: #9c79d9;
}

body[data-theme="light"] .mobile-navbar .fill-accent {
  fill: #663399;
}
</style>
