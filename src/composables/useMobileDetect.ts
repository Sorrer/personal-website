import { ref, onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 975

export function useMobileDetect() {
  const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT)

  function onResize() {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }

  onMounted(() => {
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  return { isMobile }
}
