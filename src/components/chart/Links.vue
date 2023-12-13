<template>
  <svg class="links" :width="width" :height="height">
    <polyline class="line" v-for="link in links" :key="link.id" :points="getLinkPoints(link)" />
  </svg>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { generateLinkPoints, getLinkEnds } from '@/utils'
import type { DivPosition, GanttLink } from '@/typing'
defineProps(['width', 'height'])
const positionMap = inject('positionMap', {})
const links = inject('links', [])

const getLinkPoints = (link: GanttLink) => {
  // 基于link生成起始结束坐标点
  const { start, end } = getLinkEnds(
    positionMap[link.source] as DivPosition,
    positionMap[link.target] as DivPosition,
    link.type
  )
  return generateLinkPoints(start, end, link.type)
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
