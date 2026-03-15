<template>
  <div class="scanline-overlay"></div>
</template>

<style>
.scanline-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  animation: scanline-scroll 8s linear infinite;
}

@keyframes scanline-scroll {
  0% { background-position: 0 0; }
  100% { background-position: 0 100px; }
}

body[data-theme="light"] .scanline-overlay {
  display: none;
}

@media (max-width: 975px) {
  .scanline-overlay {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0, 0, 0, 0.015) 3px,
      rgba(0, 0, 0, 0.015) 6px
    );
  }
}
</style>
