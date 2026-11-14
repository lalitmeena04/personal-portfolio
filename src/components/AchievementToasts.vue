<script setup>
import { toasts } from '../composables/useAchievements'
</script>

<template>
  <TransitionGroup tag="div" name="toast" class="toasts" role="status" aria-live="polite">
    <div v-for="toast in toasts" :key="toast.key" class="toast">
      <span class="toast__cup" aria-hidden="true">★</span>
      <span>
        <span class="pixel">Achievement unlocked</span>
        <strong class="toast__title">{{ toast.title }}</strong>
      </span>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 80;
  display: grid;
  gap: 10px;
  width: min(320px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: var(--panel-2);
  border: 1px solid var(--accent);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.toast__cup {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 1.2rem;
}

.toast__title {
  display: block;
  margin-top: 4px;
  font: 700 1.05rem/1.2 var(--font-display);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
