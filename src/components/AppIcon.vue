<script setup>
import { computed } from 'vue'

const props = defineProps({ name: { type: String, required: true } })

const GITHUB =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'

const ICONS = {
  github: { viewBox: '0 0 16 16', filled: true, body: `<path d="${GITHUB}"/>` },
  linkedin: {
    body: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10.5V17M7.5 7.2v.1M11.5 17v-6.5M11.5 13.5a2.5 2.5 0 0 1 5 0V17"/>',
  },
  mail: { body: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>' },
  phone: { body: '<rect x="7" y="2.5" width="10" height="19" rx="1.5"/><path d="M11 18h2"/>' },
  star: { body: '<path d="M12 3.5 14.6 9l6 .7-4.4 4.2 1.2 6L12 17l-5.4 2.9 1.2-6L3.4 9.7l6-.7z"/>' },
  external: { body: '<path d="M7 17 17 7M9 7h8v8"/>' },
  copy: {
    body: '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  },
  check: { body: '<path d="m5 12.5 4.5 4.5L19 7.5"/>' },
}

const icon = computed(() => ICONS[props.name])
</script>

<template>
  <svg
    class="icon"
    :viewBox="icon.viewBox ?? '0 0 24 24'"
    :fill="icon.filled ? 'currentColor' : 'none'"
    :stroke="icon.filled ? 'none' : 'currentColor'"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="icon.body"
  />
</template>

<style scoped>
.icon {
  width: 1.15em;
  height: 1.15em;
  flex: none;
}
</style>
