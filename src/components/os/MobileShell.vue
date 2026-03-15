<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MobileHeader from './MobileHeader.vue'
import MobileNavBar from './MobileNavBar.vue'
import ProfileApp from '../apps/ProfileApp.vue'
import SkillMatrixApp from '../apps/SkillMatrixApp.vue'
import CareerLogApp from '../apps/CareerLogApp.vue'
import PhotoViewerApp from '../apps/PhotoViewerApp.vue'

const route = useRoute()
const router = useRouter()

const tabs = ['profile', 'skills', 'career'] as const
const activeTab = ref<string>('profile')
const scrollContainer = ref<HTMLElement | null>(null)
const menuOpen = ref(false)
let isScrolling = false

const extraApps = [
  { id: 'photos', label: 'PHOTO VIEWER', path: '/photos' },
] as const

const activeApp = computed(() => {
  if (route.path === '/photos') return 'photos'
  return null
})

const activeAppLabel = computed(() => {
  const app = extraApps.find(a => a.id === activeApp.value)
  return app ? app.label : ''
})

function openApp(path: string) {
  menuOpen.value = false
  router.push(path)
}

function goBack() {
  activeTab.value = 'profile'
  router.push('/')
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onTabChange(tabId: string) {
  const index = tabs.indexOf(tabId as typeof tabs[number])
  if (index === -1 || !scrollContainer.value) return

  isScrolling = true
  activeTab.value = tabId
  scrollContainer.value.scrollTo({
    left: index * scrollContainer.value.clientWidth,
    behavior: 'smooth',
  })

  // Reset flag after scroll animation
  setTimeout(() => { isScrolling = false }, 400)
}

function onScroll() {
  if (isScrolling || !scrollContainer.value) return

  const { scrollLeft, clientWidth } = scrollContainer.value
  const index = Math.round(scrollLeft / clientWidth)
  if (index >= 0 && index < tabs.length) {
    activeTab.value = tabs[index]
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
      @open-menu="toggleMenu"
      @back="goBack"
    />

    <!-- Dropdown menu overlay -->
    <Transition name="menu-fade">
      <div
        v-if="menuOpen && activeApp === null"
        class="fixed inset-0 z-[999] mt-11"
        @click="closeMenu"
      >
        <div class="mobile-menu-dropdown mx-3 mt-1 rounded overflow-hidden" @click.stop>
          <button
            v-for="app in extraApps"
            :key="app.id"
            @click="openApp(app.path)"
            class="w-full flex items-center gap-3 px-4 py-3 font-lekton text-[11px] tracking-[0.15em] text-studio-300 dark:text-studio-400 hover:bg-studio-900/60 dark:hover:bg-studio-950/80 transition-colors cursor-pointer"
          >
            <span class="text-accent dark:text-primary">&gt;</span>
            {{ app.label }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- App full-screen view -->
    <template v-if="activeApp !== null">
      <div class="flex-1 overflow-y-auto mt-11">
        <PhotoViewerApp v-if="activeApp === 'photos'" />
      </div>
    </template>

    <!-- Normal tab layout -->
    <template v-else>
      <!-- Swipeable content area -->
      <div
        ref="scrollContainer"
        class="mobile-snap-container flex-1 flex overflow-x-auto overflow-y-hidden mt-11 mb-14"
      >
        <div
          v-for="tab in tabs"
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

      <!-- Bottom Nav -->
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

.mobile-menu-dropdown {
  background: linear-gradient(180deg, rgba(15, 9, 24, 0.97) 0%, rgba(8, 5, 13, 0.97) 100%);
  border: 1px solid rgba(187, 119, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(187, 119, 255, 0.08);
}

body[data-theme="light"] .mobile-menu-dropdown {
  background: linear-gradient(180deg, rgba(240, 237, 250, 0.98) 0%, rgba(228, 221, 247, 0.98) 100%);
  border: 1px solid rgba(102, 51, 153, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

body[data-theme="light"] .mobile-menu-dropdown button {
  color: #56337f;
}

/* Menu transition */
.menu-fade-enter-active {
  transition: opacity 0.15s ease;
}
.menu-fade-leave-active {
  transition: opacity 0.1s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>
