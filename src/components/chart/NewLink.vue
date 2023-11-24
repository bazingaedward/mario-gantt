<template>
  <svg
    class="new"
    :style="`top:${link.top}px;left:${link.left}px`"
    :width="link.width"
    :height="link.height"
  >
    <polyline class="line" :points="link.p" stroke-dasharray="4,2" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['layer', 'start', 'end'])

const link = computed(() => {
  const box = props.layer.getBoundingClientRect()
  return {
    height: box.height,
    width: box.width,
    top: 0,
    left: 0,
    p: `${props.start.x - box.left},${props.start.y - box.top} ${props.end.x - box.left},${
      props.end.y - box.top
    }`
  }
})
</script>

<style scoped>
.new {
  position: absolute;
  pointer-events: none;
}

.line {
  stroke: var(--wx-gantt-link-color);
  stroke-width: 2;
  fill: none;
}
</style>
