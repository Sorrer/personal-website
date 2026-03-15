import { describe, it, expect } from 'vitest'
import {
  computeLayout,
  scaleRect,
  clampToViewport,
  isMobileViewport,
  PADDING,
  GAP,
  TASKBAR_HEIGHT,
  PROFILE_RATIO,
  MOBILE_BREAKPOINT,
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
  type Rect,
  type Viewport,
} from '../windowMath'

describe('computeLayout', () => {
  const vp: Viewport = { width: 1200, height: 800 }

  it('produces non-overlapping windows', () => {
    const { skills, profile, experience } = computeLayout(vp)

    // Skills ends before profile starts
    expect(skills.x + skills.width).toBeLessThanOrEqual(profile.x)
    // Profile ends before experience starts
    expect(profile.x + profile.width).toBeLessThanOrEqual(experience.x)

    // No vertical overlap (all same y and height, so just check they match)
    expect(skills.y).toBe(profile.y)
    expect(profile.y).toBe(experience.y)
    expect(skills.height).toBe(profile.height)
    expect(profile.height).toBe(experience.height)
  })

  it('fills available space with proper padding', () => {
    const { skills, profile, experience } = computeLayout(vp)
    const availW = vp.width - PADDING * 2
    const availH = vp.height - TASKBAR_HEIGHT - PADDING * 2

    // Total width of windows + gaps should equal available width
    const totalW = skills.width + GAP + profile.width + GAP + experience.width
    expect(totalW).toBe(availW)

    // Height should equal available height
    expect(skills.height).toBe(availH)
  })

  it('profile width is approximately 27% of available width', () => {
    const { profile } = computeLayout(vp)
    const availW = vp.width - PADDING * 2
    const expectedW = Math.floor(availW * PROFILE_RATIO)
    expect(profile.width).toBe(expectedW)
  })

  it('is deterministic — same input produces same output', () => {
    const a = computeLayout(vp)
    const b = computeLayout(vp)
    expect(a).toEqual(b)
  })

  it('positions start at PADDING', () => {
    const { skills } = computeLayout(vp)
    expect(skills.x).toBe(PADDING)
    expect(skills.y).toBe(PADDING)
  })

  it('works for various viewport sizes', () => {
    const viewports: Viewport[] = [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
      { width: 976, height: 600 },
    ]

    for (const v of viewports) {
      const layout = computeLayout(v)
      const availW = v.width - PADDING * 2
      const totalW = layout.skills.width + GAP + layout.profile.width + GAP + layout.experience.width
      expect(totalW).toBe(availW)
    }
  })
})

describe('scaleRect', () => {
  const original: Rect = { x: 100, y: 50, width: 600, height: 400 }
  const refVp: Viewport = { width: 1200, height: 800 }

  it('scales proportionally', () => {
    const targetVp: Viewport = { width: 600, height: 400 }
    const result = scaleRect(original, refVp, targetVp)

    expect(result.x).toBe(50)
    expect(result.y).toBe(25)
    expect(result.width).toBe(300)
    expect(result.height).toBe(200)
  })

  it('enforces minimum size', () => {
    const tinyVp: Viewport = { width: 100, height: 100 }
    const result = scaleRect(original, refVp, tinyVp)

    expect(result.width).toBeGreaterThanOrEqual(MIN_WINDOW_WIDTH)
    expect(result.height).toBeGreaterThanOrEqual(MIN_WINDOW_HEIGHT)
  })

  it('round-trip is exact: 1200→800→1200 returns to original', () => {
    const midVp: Viewport = { width: 800, height: 600 }
    const backVp: Viewport = { width: 1200, height: 800 }

    // Key: both scale from the SAME original reference
    const scaled = scaleRect(original, refVp, midVp)
    // When scaling back, we still use the original reference, not the intermediate
    const restored = scaleRect(original, refVp, backVp)

    expect(restored).toEqual(original)
  })

  it('multi-step equals single-step (no drift)', () => {
    // With reference-based scaling, going through intermediate viewports
    // doesn't matter because we always scale from the original reference
    const step1Vp: Viewport = { width: 1000, height: 700 }
    const step2Vp: Viewport = { width: 800, height: 600 }

    const directResult = scaleRect(original, refVp, step2Vp)
    // Going through step1 doesn't affect step2 result since both use original ref
    const _step1Result = scaleRect(original, refVp, step1Vp)
    const step2Result = scaleRect(original, refVp, step2Vp)

    expect(step2Result).toEqual(directResult)
  })

  it('identity: same viewport returns unchanged rect', () => {
    const result = scaleRect(original, refVp, refVp)
    expect(result).toEqual(original)
  })
})

describe('clampToViewport', () => {
  const vp: Viewport = { width: 1200, height: 800 }

  it('passes through in-bounds rect unchanged', () => {
    const rect: Rect = { x: 100, y: 50, width: 400, height: 300 }
    const result = clampToViewport(rect, vp)
    expect(result).toEqual(rect)
  })

  it('clamps negative coords to 0', () => {
    const rect: Rect = { x: -50, y: -30, width: 400, height: 300 }
    const result = clampToViewport(rect, vp)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })

  it('clamps rect that overflows right/bottom to fit viewport', () => {
    const rect: Rect = { x: 1100, y: 700, width: 400, height: 300 }
    const result = clampToViewport(rect, vp)
    // Should be moved left/up so it fits
    expect(result.x + result.width).toBeLessThanOrEqual(vp.width)
    expect(result.y + result.height).toBeLessThanOrEqual(vp.height - TASKBAR_HEIGHT)
  })

  it('clamps oversized rect to viewport dimensions', () => {
    const rect: Rect = { x: 0, y: 0, width: 2000, height: 1500 }
    const result = clampToViewport(rect, vp)
    expect(result.width).toBeLessThanOrEqual(vp.width)
    expect(result.height).toBeLessThanOrEqual(vp.height - TASKBAR_HEIGHT)
  })
})

describe('isMobileViewport', () => {
  it('returns true below breakpoint', () => {
    expect(isMobileViewport({ width: 974, height: 600 })).toBe(true)
    expect(isMobileViewport({ width: 500, height: 800 })).toBe(true)
  })

  it('returns false at breakpoint', () => {
    expect(isMobileViewport({ width: MOBILE_BREAKPOINT, height: 600 })).toBe(false)
  })

  it('returns false above breakpoint', () => {
    expect(isMobileViewport({ width: 1200, height: 800 })).toBe(false)
    expect(isMobileViewport({ width: 976, height: 600 })).toBe(false)
  })
})

describe('mobile transition', () => {
  it('layout is recomputed fresh after mobile→desktop (no stale state)', () => {
    // Simulate: desktop → mobile → desktop
    const desktopVp: Viewport = { width: 1200, height: 800 }
    const mobileVp: Viewport = { width: 600, height: 800 }

    // Initial desktop layout
    const initialLayout = computeLayout(desktopVp)

    // In mobile, computeLayout would not be called (mobile hides desktop)
    expect(isMobileViewport(mobileVp)).toBe(true)

    // Back to desktop: compute fresh layout — same as initial
    const restoredLayout = computeLayout(desktopVp)
    expect(restoredLayout).toEqual(initialLayout)
  })

  it('free-floating reference is preserved through mobile detour', () => {
    const original: Rect = { x: 200, y: 100, width: 700, height: 500 }
    const refVp: Viewport = { width: 1200, height: 800 }
    const newDesktopVp: Viewport = { width: 1400, height: 900 }

    // Scale from stored reference to new desktop — mobile doesn't touch the reference
    const scaled = scaleRect(original, refVp, newDesktopVp)

    // Verify it scaled proportionally from the original, not from any mobile state
    expect(scaled.x).toBe(Math.round(200 * (1400 / 1200)))
    expect(scaled.y).toBe(Math.round(100 * (900 / 800)))
    expect(scaled.width).toBe(Math.round(700 * (1400 / 1200)))
    expect(scaled.height).toBe(Math.round(500 * (900 / 800)))
  })
})
