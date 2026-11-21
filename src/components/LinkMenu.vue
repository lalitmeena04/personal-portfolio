<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId } from 'vue'
import type { LinkOption } from '../data/projects'
import AppIcon from './AppIcon.vue'

defineProps<{
  label: string
  options: LinkOption[]
}>()

const EDGE_PX = 12

const root = ref<HTMLElement | null>(null)
const toggle = ref<HTMLButtonElement | null>(null)
const list = ref<HTMLElement | null>(null)
const open = ref(false)
const shift = ref(0)
const listId = useId()

const isInside = (target: EventTarget | null) => target instanceof Node && Boolean(root.value?.contains(target))

async function show() {
  shift.value = 0
  open.value = true
  document.addEventListener('pointerdown', onPointerOutside)
  await nextTick()
  if (!list.value) return
  // On a narrow screen the button can sit near the right edge; slide the list back so it stays on screen.
  const overflow = list.value.getBoundingClientRect().right - (document.documentElement.clientWidth - EDGE_PX)
  shift.value = Math.max(0, overflow)
}

function hide() {
  open.value = false
  document.removeEventListener('pointerdown', onPointerOutside)
}

function onPointerOutside(event: PointerEvent) {
  if (!isInside(event.target)) hide()
}

function onFocusOut(event: FocusEvent) {
  if (event.relatedTarget && !isInside(event.relatedTarget)) hide()
}

function onEscape() {
  if (!open.value) return
  hide()
  toggle.value?.focus()
}

onBeforeUnmount(hide)
</script>

<template>
  <div ref="root" class="menu" @keydown.esc="onEscape" @focusout="onFocusOut">
    <button
      ref="toggle"
      type="button"
      class="btn btn--sm"
      :aria-expanded="open"
      :aria-controls="listId"
      @click="open ? hide() : show()"
    >
      <AppIcon name="download" /> {{ label }} <AppIcon name="chevron" class="menu__chevron" />
    </button>
    <ul v-show="open" :id="listId" ref="list" class="menu__list" :style="{ translate: `${-shift}px 0` }">
      <li v-for="option in options" :key="option.href">
        <a :href="option.href" target="_blank" rel="noopener" @click="hide">
          {{ option.label }} <AppIcon name="external" />
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.menu {
  position: relative;
}

.menu__chevron {
  transition: rotate 0.15s;
}

.btn[aria-expanded='true'] {
  border-color: var(--accent);
  color: var(--accent);
}

.btn[aria-expanded='true'] .menu__chevron {
  rotate: 180deg;
}

.menu__list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 5;
  min-width: 100%;
  width: max-content;
  padding: 4px;
  background: var(--panel-2);
  border: 1px solid var(--accent);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
}

.menu__list a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  min-height: 44px;
  padding: 0 12px;
  font: 700 0.8rem/1 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}

.menu__list a:hover,
.menu__list a:focus-visible {
  background: var(--accent-dim);
  color: var(--accent);
}

.menu__list a:focus-visible {
  outline-offset: -2px;
}
</style>
