<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useWindowStore } from '../../stores/windowStore'

const windowStore = useWindowStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const playerScore = ref(0)
const aiScore = ref(0)
const gameStarted = ref(false)
const paused = ref(false)
const gameOver = ref(false)
const winner = ref('')
const WIN_SCORE = 7
const lossStreak = ref(0)

// Defeat messages that escalate with consecutive losses
const defeatTiers: { headline: string; sub: string; button: string }[][] = [
  // Tier 0: losses 1-2 — taunting
  [
    { headline: 'You thought you could win?', sub: 'The CPU felt nothing.', button: '[ REMATCH ]' },
    { headline: 'Was that your best?', sub: 'Genuinely asking.', button: '[ TRY AGAIN ]' },
    { headline: 'Impressive. In a bad way.', sub: 'That was hard to watch.', button: '[ ONCE MORE ]' },
  ],
  // Tier 1: losses 3-4 — stop trying
  [
    { headline: 'You can stop now.', sub: 'No one is making you do this.', button: '[ ...AGAIN ]' },
    { headline: 'This is getting painful.', sub: 'For both of us.', button: '[ KEEP GOING ]' },
    { headline: 'Maybe try a different hobby?', sub: 'Gardening is nice.', button: '[ NO ]' },
  ],
  // Tier 2: losses 5-6 — concerned (paddle starts shrinking)
  [
    { headline: 'Are you... okay?', sub: 'Fine. I\'ll make it a little easier.', button: '[ I\'M FINE ]' },
    { headline: 'I\'m starting to worry.', sub: 'I shrank my paddle. You\'re welcome.', button: '[ ONE MORE ]' },
    { headline: 'Do you need to talk to someone?', sub: 'I\'m a pong game, not a therapist.', button: '[ PLAY ]' },
  ],
  // Tier 3: losses 7-8 — genuinely worried (paddle shrinking more)
  [
    { headline: 'Please. Take a break.', sub: 'My paddle is getting tiny and you still lost.', button: '[ NO ]' },
    { headline: 'This isn\'t healthy anymore.', sub: 'I\'m practically playing with a toothpick.', button: '[ ...FINE ]' },
    { headline: 'I\'m just a game.', sub: 'You don\'t have to prove anything to me.', button: '[ BUT I DO ]' },
  ],
  // Tier 4: losses 9-10 — existential (paddle nearly gone)
  [
    { headline: 'The definition of insanity...', sub: 'My paddle is a pixel. A PIXEL.', button: '[ I KNOW ]' },
    { headline: 'I\'m begging you.', sub: 'There\'s almost nothing left of my paddle.', button: '[ NEVER ]' },
    { headline: 'At this point I respect it.', sub: 'But also how are you losing to this.', button: '[ CAN\'T STOP ]' },
  ],
  // Tier 5: losses 11-12 — acceptance (paddle about to vanish)
  [
    { headline: 'You\'re still here.', sub: 'I\'m removing my paddle next. Good luck.', button: '[ ... ]' },
    { headline: 'SYSTEM WARNING:', sub: 'Opponent paddle approaching zero.', button: '[ OVERRIDE ]' },
    { headline: 'Fine. You win.', sub: 'Not the game. But spiritually.', button: '[ AGAIN ]' },
  ],
  // Tier 6: losses 13+ — paddle gone, free wins
  [
    { headline: 'How.', sub: 'I don\'t even have a paddle anymore.', button: '[ ... ]' },
    { headline: 'This shouldn\'t be possible.', sub: 'There is literally nothing blocking you.', button: '[ WHAT ]' },
    { headline: 'I give up.', sub: 'I have no paddle. Score is open. Just go.', button: '[ OK ]' },
  ],
]

// AI difficulty scales with loss streak: paddle shrinks, speed increases
const aiPaddleHeight = computed(() => {
  const s = lossStreak.value
  if (s <= 4) return 70
  if (s <= 6) return 55
  if (s <= 8) return 38
  if (s <= 10) return 20
  if (s <= 12) return 8
  return 0 // paddle gone
})

const aiSpeedValue = computed(() => {
  const s = lossStreak.value
  if (s <= 4) return 3
  if (s <= 6) return 4.5
  if (s <= 8) return 6
  if (s <= 10) return 8
  if (s <= 12) return 12
  return 0 // no paddle, no movement
})

const defaultDefeat = { headline: 'DEFEAT', sub: '', button: '[ CONTINUE ]' }

const defeatMessage = computed(() => {
  const streak = lossStreak.value
  if (streak <= 0) return defaultDefeat
  const tierIndex = Math.min(Math.floor((streak - 1) / 2), defeatTiers.length - 1)
  const tier = defeatTiers[tierIndex]
  return tier[streak % tier.length] ?? defaultDefeat
})

// Game state
let animationId = 0
let ball = { x: 0, y: 0, vx: 0, vy: 0, radius: 6 }
let player = { x: 0, y: 0, width: 10, height: 70 }
let ai = { x: 0, y: 0, width: 10, height: 70 }
let canvasW = 0
let canvasH = 0
let mouseY = -1

// Colors matching the theme
const CYAN = '#22d3ee'
const PURPLE = '#bb77ff'
const DIM_PURPLE = 'rgba(187, 119, 255, 0.15)'
const BALL_COLOR = CYAN
const PLAYER_COLOR = PURPLE
const AI_COLOR = PURPLE

// Particle system
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

let particles: Particle[] = []

function spawnParticles(x: number, y: number, dirX: number) {
  const count = 12 + Math.floor(Math.random() * 8)
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) - Math.PI / 2 // spread in a half-circle
    const speed = 1.5 + Math.random() * 4
    const color = Math.random() > 0.4 ? CYAN : PURPLE
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed * dirX,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.4 + Math.random() * 0.4, // seconds
      color,
      size: 1.5 + Math.random() * 2.5,
    })
  }
}

function updateParticles(dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.97
    p.vy *= 0.97
    p.life -= dt / p.maxLife
    if (p.life <= 0) {
      particles.splice(i, 1)
    }
  }
}

function drawParticles(ctx: CanvasRenderingContext2D) {
  for (const p of particles) {
    const alpha = Math.max(0, p.life)
    ctx.globalAlpha = alpha
    ctx.shadowColor = p.color
    ctx.shadowBlur = 6 * alpha
    ctx.fillStyle = p.color
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
}

// Screen shake
let shakeIntensity = 0
let shakeDecay = 0.9

function triggerShake(intensity: number) {
  shakeIntensity = intensity
}

function resetBall(direction: number = 1) {
  ball.x = canvasW / 2
  ball.y = canvasH / 2
  const speed = 3.5
  const angle = (Math.random() * Math.PI / 3) - Math.PI / 6 // -30 to +30 deg
  ball.vx = Math.cos(angle) * speed * direction
  ball.vy = Math.sin(angle) * speed
}

function initGame() {
  if (!canvasRef.value || !containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  canvasW = rect.width
  canvasH = rect.height
  canvasRef.value.width = canvasW
  canvasRef.value.height = canvasH

  const paddleMargin = 20
  player.x = paddleMargin
  player.y = canvasH / 2 - player.height / 2
  player.width = 10
  player.height = 70

  ai.width = 10
  ai.height = aiPaddleHeight.value
  ai.x = canvasW - paddleMargin - ai.width
  ai.y = canvasH / 2 - ai.height / 2

  resetBall(1)
}

function startGame() {
  playerScore.value = 0
  aiScore.value = 0
  gameOver.value = false
  winner.value = ''
  gameStarted.value = true
  paused.value = false
  particles = []
  shakeIntensity = 0
  initGame()
  loop()
}

function draw(ctx: CanvasRenderingContext2D) {
  // Apply screen shake
  ctx.save()
  if (shakeIntensity > 0.1) {
    const sx = (Math.random() - 0.5) * shakeIntensity * 2
    const sy = (Math.random() - 0.5) * shakeIntensity * 2
    ctx.translate(sx, sy)
    shakeIntensity *= shakeDecay
  } else {
    shakeIntensity = 0
  }

  // Clear
  ctx.fillStyle = 'rgba(8, 5, 13, 0.95)'
  ctx.fillRect(-4, -4, canvasW + 8, canvasH + 8)

  // Center dashed line
  ctx.setLineDash([6, 8])
  ctx.strokeStyle = DIM_PURPLE
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(canvasW / 2, 0)
  ctx.lineTo(canvasW / 2, canvasH)
  ctx.stroke()
  ctx.setLineDash([])

  // Top and bottom borders
  ctx.strokeStyle = DIM_PURPLE
  ctx.lineWidth = 1
  ctx.strokeRect(0, 0, canvasW, canvasH)

  // Particles (behind paddles/ball)
  drawParticles(ctx)

  // Player paddle with glow
  ctx.shadowColor = PURPLE
  ctx.shadowBlur = 12
  ctx.fillStyle = PLAYER_COLOR
  ctx.fillRect(player.x, player.y, player.width, player.height)

  // AI paddle with glow (skip if removed)
  if (ai.height > 0) {
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height)
  }
  ctx.shadowBlur = 0

  // Ball with glow
  ctx.shadowColor = CYAN
  ctx.shadowBlur = 16
  ctx.fillStyle = BALL_COLOR
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Ball trail effect (subtle)
  ctx.fillStyle = 'rgba(34, 211, 238, 0.08)'
  ctx.beginPath()
  ctx.arc(ball.x - ball.vx * 2, ball.y - ball.vy * 2, ball.radius * 1.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function update() {
  // Update particles (~16ms per frame at 60fps)
  updateParticles(1 / 60)

  // Move ball
  ball.x += ball.vx
  ball.y += ball.vy

  // Top/bottom bounce
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius
    ball.vy = Math.abs(ball.vy)
  }
  if (ball.y + ball.radius >= canvasH) {
    ball.y = canvasH - ball.radius
    ball.vy = -Math.abs(ball.vy)
  }

  // Player paddle collision
  if (
    ball.x - ball.radius <= player.x + player.width &&
    ball.x + ball.radius >= player.x &&
    ball.y + ball.radius >= player.y &&
    ball.y - ball.radius <= player.y + player.height &&
    ball.vx < 0
  ) {
    ball.vx = Math.abs(ball.vx) * 1.03
    const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2)
    ball.vy += hitPos * 2
    ball.x = player.x + player.width + ball.radius
    spawnParticles(ball.x, ball.y, 1)
    triggerShake(4)
  }

  // AI paddle collision (skip if paddle is gone)
  if (
    ai.height > 0 &&
    ball.x + ball.radius >= ai.x &&
    ball.x - ball.radius <= ai.x + ai.width &&
    ball.y + ball.radius >= ai.y &&
    ball.y - ball.radius <= ai.y + ai.height &&
    ball.vx > 0
  ) {
    ball.vx = -Math.abs(ball.vx) * 1.03
    const hitPos = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2)
    ball.vy += hitPos * 2
    ball.x = ai.x - ball.radius
    spawnParticles(ball.x, ball.y, -1)
    triggerShake(4)
  }

  // Clamp ball speed
  const maxSpeed = 8
  const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
  if (speed > maxSpeed) {
    ball.vx = (ball.vx / speed) * maxSpeed
    ball.vy = (ball.vy / speed) * maxSpeed
  }

  // Score
  if (ball.x < -ball.radius) {
    aiScore.value++
    if (aiScore.value >= WIN_SCORE) {
      gameOver.value = true
      winner.value = 'CPU'
      gameStarted.value = false
      lossStreak.value++
    } else {
      resetBall(1)
    }
  }
  if (ball.x > canvasW + ball.radius) {
    playerScore.value++
    if (playerScore.value >= WIN_SCORE) {
      gameOver.value = true
      winner.value = 'PLAYER'
      gameStarted.value = false
      lossStreak.value = 0
    } else {
      resetBall(-1)
    }
  }

  // Player paddle: keyboard input (continuous while held)
  const keySpeed = 6
  if (keysDown.has('ArrowUp')) {
    player.y -= keySpeed
  }
  if (keysDown.has('ArrowDown')) {
    player.y += keySpeed
  }

  // Player paddle: mouse input
  if (mouseY >= 0) {
    const target = mouseY - player.height / 2
    player.y = target
  }

  player.y = Math.max(0, Math.min(canvasH - player.height, player.y))

  // AI paddle tracks ball (speed and size scale with loss streak)
  if (ai.height > 0) {
    const aiSpeed = aiSpeedValue.value
    const aiTarget = ball.y - ai.height / 2
    if (ai.y < aiTarget) {
      ai.y = Math.min(ai.y + aiSpeed, aiTarget)
    } else if (ai.y > aiTarget) {
      ai.y = Math.max(ai.y - aiSpeed, aiTarget)
    }
    ai.y = Math.max(0, Math.min(canvasH - ai.height, ai.y))
  }
}

function loop() {
  if (!gameStarted.value || paused.value) return
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  update()
  draw(ctx)

  if (!gameOver.value) {
    animationId = requestAnimationFrame(loop)
  } else {
    // Draw final frame
    draw(ctx)
  }
}

function onMouseMove(e: MouseEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  mouseY = e.clientY - rect.top
}

function onTouchMove(e: TouchEvent) {
  if (!canvasRef.value || e.touches.length === 0) return
  const rect = canvasRef.value.getBoundingClientRect()
  mouseY = e.touches[0].clientY - rect.top
}

const keysDown = new Set<string>()

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    keysDown.add(e.key)
    mouseY = -1
  }
}

function onKeyUp(e: KeyboardEvent) {
  keysDown.delete(e.key)
}

function togglePause() {
  if (!gameStarted.value) return
  paused.value = !paused.value
  if (!paused.value) loop()
}

// Watch for window focus/minimize to pause
watch(
  () => windowStore.windows.pong?.isFocused,
  (focused) => {
    if (!focused && gameStarted.value && !paused.value) {
      paused.value = true
    }
  }
)

// Handle resize
function onResize() {
  if (!containerRef.value || !canvasRef.value || !gameStarted.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const scaleX = rect.width / canvasW
  const scaleY = rect.height / canvasH

  canvasW = rect.width
  canvasH = rect.height
  canvasRef.value.width = canvasW
  canvasRef.value.height = canvasH

  // Scale positions
  ball.x *= scaleX
  ball.y *= scaleY
  player.y *= scaleY
  ai.x = canvasW - 30
  ai.y *= scaleY
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="h-full w-full flex flex-col font-lekton overflow-hidden bg-studio-1050/50">

    <!-- Header Bar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-primary/15">
      <div class="flex items-center gap-3">
        <span class="text-bright-500/70 text-[10px] tracking-[0.2em]">// ARCADE</span>
        <span class="text-primary text-xs tracking-wide">PONG v1.0</span>
      </div>
      <div class="flex items-center gap-4 text-[10px] tracking-widest">
        <span class="text-studio-500">FIRST TO {{ WIN_SCORE }}</span>
        <button
          v-if="gameStarted"
          @click="togglePause"
          class="text-bright-500 hover:text-bright-400 transition-colors cursor-pointer"
        >
          {{ paused ? '[ RESUME ]' : '[ PAUSE ]' }}
        </button>
      </div>
    </div>

    <!-- Scoreboard -->
    <div class="flex items-center justify-center gap-8 py-2 select-none">
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-studio-500 tracking-widest">P1</span>
        <span class="text-2xl text-primary font-bold tabular-nums">{{ String(playerScore).padStart(2, '0') }}</span>
      </div>
      <span class="text-studio-600 text-xs">:</span>
      <div class="flex items-center gap-2">
        <span class="text-2xl text-primary font-bold tabular-nums">{{ String(aiScore).padStart(2, '0') }}</span>
        <span class="text-[10px] text-studio-500 tracking-widest">CPU</span>
      </div>
    </div>

    <!-- Game Canvas Area -->
    <div
      ref="containerRef"
      class="flex-1 relative mx-3 mb-3 border border-primary/20 rounded-sm overflow-hidden"
      @mousemove="onMouseMove"
      @touchmove.prevent="onTouchMove"
    >
      <canvas ref="canvasRef" class="block w-full h-full" />

      <!-- Start Overlay -->
      <div
        v-if="!gameStarted && !gameOver"
        class="absolute inset-0 flex flex-col items-center justify-center bg-studio-1050/80"
      >
        <p class="text-primary text-lg tracking-widest mb-1">PONG.EXE</p>
        <p class="text-studio-500 text-[10px] tracking-widest mb-6">HEXCORE ARCADE SYSTEM</p>
        <button
          @click="startGame"
          class="px-6 py-2 border border-primary text-primary text-xs tracking-widest hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(187,119,255,0.3)] transition-all duration-200 cursor-pointer"
        >
          [ START GAME ]
        </button>
        <p class="text-studio-600 text-[10px] tracking-wider mt-4">MOUSE OR ARROW KEYS TO MOVE</p>
      </div>

      <!-- Paused Overlay -->
      <div
        v-if="paused && gameStarted"
        class="absolute inset-0 flex flex-col items-center justify-center bg-studio-1050/70"
      >
        <p class="text-primary text-sm tracking-[0.3em] animate-pulse">PAUSED</p>
        <button
          @click="togglePause"
          class="mt-4 px-4 py-1.5 border border-primary/50 text-primary/70 text-[10px] tracking-widest hover:bg-primary/10 transition-all duration-200 cursor-pointer"
        >
          [ RESUME ]
        </button>
      </div>

      <!-- Game Over: Victory -->
      <div
        v-if="gameOver && winner === 'PLAYER'"
        class="absolute inset-0 flex flex-col items-center justify-center bg-studio-1050/80"
      >
        <p class="text-[10px] text-studio-500 tracking-[0.3em] mb-2">MATCH COMPLETE</p>
        <p class="text-xl tracking-widest mb-1 text-bright-400">VICTORY</p>
        <p class="text-studio-500 text-xs mb-6">
          {{ playerScore }} &ndash; {{ aiScore }}
        </p>
        <button
          @click="startGame"
          class="px-6 py-2 border border-primary text-primary text-xs tracking-widest hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(187,119,255,0.3)] transition-all duration-200 cursor-pointer"
        >
          [ PLAY AGAIN ]
        </button>
      </div>

      <!-- Game Over: Defeat -->
      <div
        v-if="gameOver && winner === 'CPU'"
        class="absolute inset-0 flex flex-col items-center justify-center bg-studio-1050/85"
      >
        <p class="text-[10px] tracking-[0.3em] mb-3" :class="lossStreak >= 5 ? 'text-red-400/60' : 'text-studio-500'">
          {{ lossStreak >= 9 ? 'LOSS #' + lossStreak : 'MATCH COMPLETE' }}
        </p>
        <p class="text-lg tracking-widest mb-2 text-center px-6 leading-relaxed" :class="[
          lossStreak >= 7 ? 'text-red-300' : lossStreak >= 5 ? 'text-red-400' : 'text-studio-200'
        ]">
          {{ defeatMessage.headline }}
        </p>
        <p class="text-xs mb-1 text-studio-500">
          {{ playerScore }} &ndash; {{ aiScore }}
        </p>
        <p class="text-[10px] tracking-wider mb-6 text-center px-8" :class="lossStreak >= 7 ? 'text-red-400/50' : 'text-studio-600'">
          {{ defeatMessage.sub }}
        </p>
        <button
          @click="startGame"
          class="px-6 py-2 border text-xs tracking-widest transition-all duration-200 cursor-pointer"
          :class="lossStreak >= 7
            ? 'border-red-400/40 text-red-400/70 hover:bg-red-400/10 hover:shadow-[0_0_12px_rgba(248,113,113,0.2)]'
            : 'border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(187,119,255,0.3)]'"
        >
          {{ defeatMessage.button }}
        </button>
      </div>
    </div>
  </div>
</template>
