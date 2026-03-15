import { defineStore } from "pinia"
import { ref, computed } from "vue"
import {
  computeLayout,
  scaleRect,
  isMobileViewport,
  PADDING,
  TASKBAR_HEIGHT,
  type Rect,
  type Viewport,
} from "@/helpers/windowMath"

export interface WindowState {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  isLoading: boolean
  loadingProgress: number
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  defaultSize: { width: number; height: number }
  referenceRect?: Rect
  referenceViewport?: Viewport
}

let nextZIndex = 10

const LAYOUT_WINDOWS = ['profile', 'skills', 'experience']

export const useWindowStore = defineStore('windowStore', () => {

  let wasMobile = false

  const windows = ref<Record<string, WindowState>>({
    profile: {
      id: 'profile',
      title: 'PROFILE',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isFocused: false,
      isLoading: false,
      loadingProgress: 0,
      zIndex: nextZIndex++,
      position: { x: 0, y: 0 },
      size: { width: 400, height: 500 },
      defaultSize: { width: 400, height: 500 },
    },
    skills: {
      id: 'skills',
      title: 'STATS SCANNER',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isFocused: false,
      isLoading: false,
      loadingProgress: 0,
      zIndex: nextZIndex++,
      position: { x: 0, y: 0 },
      size: { width: 600, height: 400 },
      defaultSize: { width: 600, height: 400 },
    },
    experience: {
      id: 'experience',
      title: 'CAREER LOG',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isFocused: false,
      isLoading: false,
      loadingProgress: 0,
      zIndex: nextZIndex++,
      position: { x: 0, y: 0 },
      size: { width: 600, height: 300 },
      defaultSize: { width: 600, height: 300 },
    },
    projects: {
      id: 'projects',
      title: 'PROJECT ARCHIVE',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isFocused: false,
      isLoading: false,
      loadingProgress: 0,
      zIndex: nextZIndex++,
      position: { x: 0, y: 0 },
      size: { width: 650, height: 520 },
      defaultSize: { width: 650, height: 520 },
    },
    photos: {
      id: 'photos',
      title: 'PHOTO VIEWER',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isFocused: false,
      isLoading: false,
      loadingProgress: 0,
      zIndex: nextZIndex++,
      position: { x: 0, y: 0 },
      size: { width: 1095, height: 650 },
      defaultSize: { width: 1095, height: 650 },
    },
  })

  function applyRect(win: WindowState, rect: Rect) {
    win.position.x = rect.x
    win.position.y = rect.y
    win.size.width = rect.width
    win.size.height = rect.height
  }

  function snapshotReference(win: WindowState) {
    win.referenceRect = {
      x: win.position.x,
      y: win.position.y,
      width: win.size.width,
      height: win.size.height,
    }
    win.referenceViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  function layoutWindows() {
    const vp: Viewport = { width: window.innerWidth, height: window.innerHeight }
    const layout = computeLayout(vp)

    applyRect(windows.value.skills, layout.skills)
    applyRect(windows.value.profile, layout.profile)
    applyRect(windows.value.experience, layout.experience)

    // Snapshot references for free-floating windows
    for (const key in windows.value) {
      if (!LAYOUT_WINDOWS.includes(key)) {
        snapshotReference(windows.value[key])
      }
    }

    wasMobile = false
  }

  function rescaleWindows() {
    const vp: Viewport = { width: window.innerWidth, height: window.innerHeight }

    // Case 1: Currently mobile — do nothing, desktop is hidden
    if (isMobileViewport(vp)) {
      wasMobile = true
      return
    }

    // Case 2: Was mobile, now desktop — full fresh re-layout
    if (wasMobile) {
      layoutWindows()
      return
    }

    // Case 3: Desktop→desktop — deterministic layout for layout windows, scale from reference for free-floating
    const layout = computeLayout(vp)
    applyRect(windows.value.skills, layout.skills)
    applyRect(windows.value.profile, layout.profile)
    applyRect(windows.value.experience, layout.experience)

    for (const key in windows.value) {
      if (!LAYOUT_WINDOWS.includes(key)) {
        const win = windows.value[key]
        if (win.referenceRect && win.referenceViewport) {
          applyRect(win, scaleRect(win.referenceRect, win.referenceViewport, vp))
        }
      }
    }
  }

  const windowList = computed(() => Object.values(windows.value))

  // Focus history stack — most recent at the end
  const MAX_FOCUS_HISTORY = 100
  const focusHistory: string[] = []

  function pushFocusHistory(id: string) {
    // Remove any existing entry for this id
    const idx = focusHistory.indexOf(id)
    if (idx !== -1) focusHistory.splice(idx, 1)
    focusHistory.push(id)
    // Eject oldest if over limit
    if (focusHistory.length > MAX_FOCUS_HISTORY) {
      focusHistory.shift()
    }
  }

  function popFocusFallback(): string | null {
    // Walk backwards to find the most recent window that's still open and not minimized
    for (let i = focusHistory.length - 1; i >= 0; i--) {
      const id = focusHistory[i]
      const win = windows.value[id]
      if (win && win.isOpen && !win.isMinimized) {
        return id
      }
    }
    return null
  }

  function focusWindow(id: string) {
    for (const key in windows.value) {
      windows.value[key].isFocused = false
    }
    const win = windows.value[id]
    if (win) {
      win.isFocused = true
      win.zIndex = nextZIndex++
      pushFocusHistory(id)
    }
  }

  // Reference resolution that defaultSize values were designed for
  const REF_WIDTH = 1920
  const REF_HEIGHT = 1080

  function openWindow(id: string) {
    const win = windows.value[id]
    if (win) {
      // Reset size and center free-floating windows when opening from closed state
      if (!win.isOpen && !LAYOUT_WINDOWS.includes(id)) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const availW = vw - PADDING * 2
        const availH = vh - TASKBAR_HEIGHT - PADDING * 2
        const refAvailW = REF_WIDTH - PADDING * 2
        const refAvailH = REF_HEIGHT - TASKBAR_HEIGHT - PADDING * 2

        // Scale defaultSize proportionally to viewport (relative to 1920x1080 reference)
        const scaledW = Math.round(win.defaultSize.width * (availW / refAvailW))
        const scaledH = Math.round(win.defaultSize.height * (availH / refAvailH))
        win.size.width = Math.min(scaledW, availW)
        win.size.height = Math.min(scaledH, availH)
        win.isMaximized = false

        win.position.x = Math.max(PADDING, Math.floor((vw - win.size.width) / 2))
        win.position.y = Math.max(PADDING, Math.floor((vh - TASKBAR_HEIGHT - win.size.height) / 2))
        snapshotReference(win)
      }
      win.isOpen = true
      win.isMinimized = false
      focusWindow(id)
    }
  }

  function closeWindow(id: string) {
    const win = windows.value[id]
    if (win) {
      const wasFocused = win.isFocused
      win.isOpen = false
      win.isFocused = false

      if (wasFocused) {
        const fallback = popFocusFallback()
        if (fallback) {
          focusWindow(fallback)
        } else {
          // Default to profile if nothing in history
          const profile = windows.value.profile
          if (profile && profile.isOpen && !profile.isMinimized) {
            focusWindow('profile')
          }
        }
      }
    }
  }

  function minimizeWindow(id: string) {
    const win = windows.value[id]
    if (win) {
      const wasFocused = win.isFocused
      win.isMinimized = true
      win.isFocused = false

      if (wasFocused) {
        const fallback = popFocusFallback()
        if (fallback) {
          focusWindow(fallback)
        } else {
          const profile = windows.value.profile
          if (profile && profile.isOpen && !profile.isMinimized) {
            focusWindow('profile')
          }
        }
      }
    }
  }

  function maximizeWindow(id: string) {
    const win = windows.value[id]
    if (win) {
      win.isMaximized = !win.isMaximized
      focusWindow(id)
    }
  }

  function restoreWindow(id: string) {
    const win = windows.value[id]
    if (win) {
      win.isMinimized = false
      focusWindow(id)
    }
  }

  function updatePosition(id: string, x: number, y: number) {
    const win = windows.value[id]
    if (win) {
      win.position.x = x
      win.position.y = y
      // Snapshot reference for free-floating windows on user interaction
      if (!LAYOUT_WINDOWS.includes(id)) {
        snapshotReference(win)
      }
    }
  }

  function updateSize(id: string, width: number, height: number) {
    const win = windows.value[id]
    if (win) {
      win.size.width = width
      win.size.height = height
      // Snapshot reference for free-floating windows on user interaction
      if (!LAYOUT_WINDOWS.includes(id)) {
        snapshotReference(win)
      }
    }
  }

  function setLoading(id: string, loading: boolean) {
    const win = windows.value[id]
    if (win) {
      win.isLoading = loading
      if (!loading) win.loadingProgress = 0
    }
  }

  function setLoadingProgress(id: string, progress: number) {
    const win = windows.value[id]
    if (win) {
      win.loadingProgress = progress
    }
  }

  function resetAllWindows() {
    nextZIndex = 10
    focusHistory.length = 0
    for (const key in windows.value) {
      const win = windows.value[key]
      win.isOpen = false
      win.isMinimized = false
      win.isMaximized = false
      win.isFocused = false
      win.isLoading = false
      win.loadingProgress = 0
      win.zIndex = nextZIndex++
    }
    layoutWindows()
  }

  return {
    windows,
    windowList,
    focusWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updatePosition,
    updateSize,
    setLoading,
    setLoadingProgress,
    layoutWindows,
    rescaleWindows,
    resetAllWindows,
  }
})
