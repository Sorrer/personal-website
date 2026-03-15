<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MobileHeader from './MobileHeader.vue'
import MobileNavBar from './MobileNavBar.vue'
import ProfileApp from '../apps/ProfileApp.vue'
import SkillMatrixApp from '../apps/SkillMatrixApp.vue'
import CareerLogApp from '../apps/CareerLogApp.vue'
import PhotoViewerApp from '../apps/PhotoViewerApp.vue'
import ProjectsApp from '../apps/ProjectsApp.vue'

const route = useRoute()
const router = useRouter()

const swipeTabs = ['profile', 'skills', 'career'] as const
const activeTab = ref<string>('profile')
const scrollContainer = ref<HTMLElement | null>(null)
let isScrolling = false

const extraApps = [
  { id: 'projects', label: 'PROJECT ARCHIVE', path: '/projects' },
  { id: 'photos', label: 'PHOTO VIEWER', path: '/photos' },
] as const

const activeApp = computed(() => {
  if (route.path === '/photos') return 'photos'
  if (route.path === '/projects') return 'projects'
  return null
})

const activeAppLabel = computed(() => {
  const app = extraApps.find(a => a.id === activeApp.value)
  return app ? app.label : ''
})

function openApp(path: string) {
  router.push(path)
}

function goBack() {
  activeTab.value = 'more'
  router.push('/')
}

function onTabChange(tabId: string) {
  if (tabId === 'more') {
    activeTab.value = 'more'
    return
  }

  const index = swipeTabs.indexOf(tabId as typeof swipeTabs[number])
  if (index === -1 || !scrollContainer.value) {
    activeTab.value = tabId
    return
  }

  isScrolling = true
  activeTab.value = tabId
  scrollContainer.value.scrollTo({
    left: index * scrollContainer.value.clientWidth,
    behavior: 'smooth',
  })

  setTimeout(() => { isScrolling = false }, 400)
}

function onScroll() {
  if (isScrolling || !scrollContainer.value) return

  const { scrollLeft, clientWidth } = scrollContainer.value
  const index = Math.round(scrollLeft / clientWidth)
  if (index >= 0 && index < swipeTabs.length) {
    activeTab.value = swipeTabs[index]
  }
}

let scrollTimeout: ReturnType<typeof setTimeout> | null = null

function onScrollThrottled() {
  if (scrollTimeout) return
  scrollTimeout = setTimeout(() => {
    onScroll()
    scrollTimeout = null
  }, 50)
}

watch(scrollContainer, (newEl, oldEl) => {
  oldEl?.removeEventListener('scroll', onScrollThrottled)
  newEl?.addEventListener('scroll', onScrollThrottled, { passive: true })
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', onScrollThrottled)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<template>
  <div class="mobile-shell fixed inset-0 flex flex-col">
    <!-- Header -->
    <MobileHeader
      :active-tab="activeTab"
      :show-back="activeApp !== null"
      :app-label="activeAppLabel"
      @back="goBack"
    />

    <!-- App full-screen view (no bottom nav) -->
    <template v-if="activeApp !== null">
      <div class="flex-1 overflow-y-auto mt-11">
        <PhotoViewerApp v-if="activeApp === 'photos'" />
        <ProjectsApp v-if="activeApp === 'projects'" />
      </div>
    </template>

    <!-- More tab content -->
    <template v-else-if="activeTab === 'more'">
      <div class="flex-1 overflow-y-auto mt-11 mb-14 p-4">
        <div class="font-lekton text-[10px] tracking-[0.2em] text-studio-500 dark:text-studio-400 mb-4">
          <span class="text-accent dark:text-primary">[</span> APPLICATIONS <span class="text-accent dark:text-primary">]</span>
        </div>
        <div class="flex flex-col gap-2">
          <button
            v-for="app in extraApps"
            :key="app.id"
            @click="openApp(app.path)"
            class="more-app-button flex items-center gap-3 px-4 py-3.5 rounded font-lekton text-xs tracking-[0.12em] text-studio-300 dark:text-studio-400 transition-colors cursor-pointer text-left"
          >
            <span class="text-accent dark:text-primary text-sm">&gt;</span>
            {{ app.label }}
          </button>
        </div>
      </div>

      <MobileNavBar :active-tab="activeTab" @change="onTabChange" />
    </template>

    <!-- Normal swipeable tab layout -->
    <template v-else>
      <div
        ref="scrollContainer"
        class="mobile-snap-container flex-1 flex overflow-x-auto overflow-y-hidden mt-11 mb-14"
      >
        <div
          v-for="tab in swipeTabs"
          :key="tab"
          class="mobile-snap-page w-screen shrink-0 overflow-y-auto"
        >
          <div class="min-h-full p-4 pb-8">
            <ProfileApp v-if="tab === 'profile'" />
            <SkillMatrixApp v-if="tab === 'skills'" />
            <CareerLogApp v-if="tab === 'career'" />
          </div>
        </div>
      </div>

      <MobileNavBar :active-tab="activeTab" @change="onTabChange" />
    </template>
  </div>
</template>

<style>
.mobile-snap-container {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mobile-snap-container::-webkit-scrollbar {
  display: none;
}

.mobile-snap-page {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.more-app-button {
  background: rgba(15, 9, 24, 0.6);
  border: 1px solid rgba(187, 119, 255, 0.12);
}

.more-app-button:hover {
  background: rgba(15, 9, 24, 0.8);
  border-color: rgba(187, 119, 255, 0.25);
}

body[data-theme="light"] .more-app-button {
  background: rgba(228, 221, 247, 0.5);
  border: 1px solid rgba(102, 51, 153, 0.15);
  color: #56337f;
}

body[data-theme="light"] .more-app-button:hover {
  background: rgba(228, 221, 247, 0.8);
  border-color: rgba(102, 51, 153, 0.3);
}
</style>
