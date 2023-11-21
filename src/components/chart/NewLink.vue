<template>
  <svg
    class="new"
    :style="`top:${link.top}px;left:${link.left}px`"
    :width="link.width"
    :height="link.height"
  >
    <polyline class="line" :points="link.p" />
  </svg>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { placeLink } from '@dhtmlx/trial-lib-gantt'

const props = defineProps(['layer', 'start', 'end'])

const link = computed(() => {
  const box = props.layer.getBoundingClientRect()
  const link = placeLink(box, props.start, props.end)
  return link
})
</script>

<style scoped>
.new {
  position: relative;
  pointer-events: none;
}

.line {
  stroke: var(--wx-gantt-link-color);
  stroke-width: 2;
  fill: none;
}
</style>
