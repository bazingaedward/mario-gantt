<template>
  <svg class="links" :width="width" :height="height">
    <polyline class="line" v-for="link in links" :key="link.id" :points="getLinkPoints(link)" />
  </svg>
</template>

<script setup lang="ts">
import type { GanttLink } from '@/typing'
import { generateLinkPoints } from '@/utils'
defineProps(['links', 'width', 'height'])

const getLinkPoints = (link: GanttLink) => {
  return generateLinkPoints({ x: 400, y: 19 }, { x: 100, y: 57 })
}
</script>

<style scoped>
.links {
  position: absolute;
  top: 0;
  left: 0;
}

.line {
  user-select: auto;
  pointer-events: stroke;
  position: relative;
  cursor: pointer;
  stroke: var(--wx-gantt-link-color);
  stroke-width: 2;
  z-index: 0;
  fill: transparent;
}
</style>
