// Shared constants
export const PADDING = 20
export const GAP = 12
export const TASKBAR_HEIGHT = 48
export const PROFILE_RATIO = 0.27
export const MOBILE_BREAKPOINT = 975
export const MIN_WINDOW_WIDTH = 300
export const MIN_WINDOW_HEIGHT = 200

// Types
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Viewport {
  width: number
  height: number
}

/**
 * Compute the deterministic 3-column layout for skills, profile, and experience windows.
 * Same input always produces the same output — no accumulated drift.
 */
export function computeLayout(vp: Viewport): { skills: Rect; profile: Rect; experience: Rect } {
  const availW = vp.width - PADDING * 2
  const availH = vp.height - TASKBAR_HEIGHT - PADDING * 2

  const profileW = Math.floor(availW * PROFILE_RATIO)
  const remainW = availW - profileW - GAP * 2
  const sideW = Math.floor(remainW / 2)

  const skills: Rect = {
    x: PADDING,
    y: PADDING,
    width: sideW,
    height: availH,
  }

  const profile: Rect = {
    x: PADDING + sideW + GAP,
    y: PADDING,
    width: profileW,
    height: availH,
  }

  const experience: Rect = {
    x: PADDING + sideW + GAP + profileW + GAP,
    y: PADDING,
    width: remainW - sideW,
    height: availH,
  }

  return { skills, profile, experience }
}

/**
 * Scale a rect proportionally from a stored reference viewport to the current viewport.
 * Always computes from the original reference — never from intermediate values — so no drift.
 */
export function scaleRect(original: Rect, refViewport: Viewport, currentViewport: Viewport): Rect {
  const scaleX = currentViewport.width / refViewport.width
  const scaleY = currentViewport.height / refViewport.height

  return {
    x: Math.round(original.x * scaleX),
    y: Math.round(original.y * scaleY),
    width: Math.max(MIN_WINDOW_WIDTH, Math.round(original.width * scaleX)),
    height: Math.max(MIN_WINDOW_HEIGHT, Math.round(original.height * scaleY)),
  }
}

/**
 * Clamp a rect so it stays within the viewport bounds.
 */
export function clampToViewport(rect: Rect, vp: Viewport): Rect {
  const width = Math.min(rect.width, vp.width)
  const height = Math.min(rect.height, vp.height - TASKBAR_HEIGHT)
  const x = Math.max(0, Math.min(rect.x, vp.width - width))
  const y = Math.max(0, Math.min(rect.y, vp.height - TASKBAR_HEIGHT - height))

  return { x, y, width, height }
}

/**
 * Returns true if the viewport is below the mobile breakpoint.
 */
export function isMobileViewport(vp: Viewport): boolean {
  return vp.width < MOBILE_BREAKPOINT
}
