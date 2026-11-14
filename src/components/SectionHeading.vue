<script setup>
defineProps({
  index: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
})
</script>

<template>
  <header v-reveal class="heading">
    <p class="pixel">{{ index }} // {{ kicker }}</p>
    <h2 class="heading__title">{{ title }}</h2>
    <p v-if="$slots.default" class="heading__lead"><slot /></p>
  </header>
</template>

<style scoped>
.heading {
  margin-bottom: clamp(28px, 4vw, 48px);
}

.heading__title {
  margin-top: 14px;
  font-size: clamp(2rem, 4.6vw, 3.4rem);
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.heading__lead {
  max-width: 60ch;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 1.05rem;
}
</style>
