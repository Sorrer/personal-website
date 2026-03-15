<script setup lang="ts">
defineProps<{
  shortName: string
  state: 'focused' | 'connected' | 'idle'
}>()

defineEmits<{
  select: []
}>()

// Pointy-top hexagon points for a 46x42 hex centered at (23, 21)
const hexPoints = (() => {
  const w = 46
  const h = 42
  const cx = w / 2
  const cy = h / 2
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30
    const angleRad = (Math.PI / 180) * angleDeg
    const px = cx + (w / 2) * Math.cos(angleRad)
    const py = cy + (h / 2) * Math.sin(angleRad)
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`)
  }
  return points.join(' ')
})()
</script>

<template>
  <g
    class="hex-node"
    :class="state"
    @click="$emit('select')"
  >
    <polygon
      :points="hexPoints"
      class="hex-shape"
    />
    <text
      x="23"
      y="22"
      text-anchor="middle"
      dominant-baseline="central"
      class="hex-label"
    >{{ shortName }}</text>
  </g>
</template>

<style scoped>
.hex-node {
  cursor: pointer;
  transform-origin: 23px 21px;
  transition: transform 0.6s ease, opacity 0.6s ease;
}

.hex-shape {
  stroke-width: 1.5;
  transition: fill 0.6s ease, stroke 0.6s ease, filter 0.6s ease, opacity 0.6s ease;
}

.hex-label {
  font-family: 'Lekton', monospace;
  font-size: 10px;
  letter-spacing: 0.5px;
  transition: fill 0.6s ease, opacity 0.6s ease;
  pointer-events: none;
}

/* Idle state */
.idle .hex-shape {
  fill: rgba(25, 15, 39, 0.5);
  stroke: #7d4bb9;
  opacity: 0.45;
}
.idle .hex-label {
  fill: #9c79d9;
  opacity: 0.5;
}

/* Connected state */
.connected .hex-shape {
  fill: rgba(54, 32, 85, 0.6);
  stroke: #bb77ff;
  opacity: 0.85;
  filter: drop-shadow(0 0 3px rgba(187, 119, 255, 0.3));
}
.connected .hex-label {
  fill: #bb77ff;
  opacity: 0.85;
}

/* Focused state */
.focused {
  transform: scale(1.2);
}
.focused .hex-shape {
  fill: rgb(10, 46, 47);
  stroke: #34e4ea;
  opacity: 1;
  filter: drop-shadow(0 0 6px rgba(52, 228, 234, 0.5));
}
.focused .hex-label {
  fill: #34e4ea;
  opacity: 1;
}

/* Light theme */
:root:not(.dark) .idle .hex-shape {
  fill: rgba(228, 221, 247, 0.7);
  stroke: #9c79d9;
  opacity: 0.55;
}
:root:not(.dark) .idle .hex-label {
  fill: #7d4bb9;
  opacity: 0.55;
}

:root:not(.dark) .connected .hex-shape {
  fill: rgba(207, 194, 240, 0.8);
  stroke: #8c5bcc;
  opacity: 0.9;
  filter: drop-shadow(0 0 3px rgba(140, 91, 204, 0.3));
}
:root:not(.dark) .connected .hex-label {
  fill: #663399;
  opacity: 0.9;
}

:root:not(.dark) .focused .hex-shape {
  fill: rgb(214, 250, 251);
  stroke: #1f898c;
  opacity: 1;
  filter: drop-shadow(0 0 4px rgba(42, 182, 187, 0.4));
}
:root:not(.dark) .focused .hex-label {
  fill: #155b5e;
  opacity: 1;
}
</style>
