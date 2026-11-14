<script setup>
import { computed } from 'vue'

// Pixel art from an array of equal-length strings; every 'X' becomes one filled cell.
const props = defineProps({ rows: { type: Array, required: true } })

const cells = computed(() =>
  props.rows.flatMap((row, y) => [...row].flatMap((cell, x) => (cell === 'X' ? [{ x, y }] : []))),
)
</script>

<template>
  <svg :viewBox="`0 0 ${rows[0].length} ${rows.length}`" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">
    <rect v-for="cell in cells" :key="`${cell.x}-${cell.y}`" :x="cell.x" :y="cell.y" width="1" height="1" />
  </svg>
</template>
