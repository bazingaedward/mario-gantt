<template>
  <svg class="links" :width="width" :height="height">
    <polyline class="line" v-for="link in links" :key="link.id" :points="getLinkPoints(link)" />
  </svg>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { DivPosition, GanttLink } from '@/typing'
import { generateLinkPoints, getLinkEnds } from '@/utils'
defineProps(['links', 'width', 'height'])

const getLinkPoints = (link: GanttLink) => {
  const positionMap = inject('positionMap', {})

  // 基于link生成起始结束坐标点
  const { start, end } = getLinkEnds(
    positionMap[link.source] as DivPosition,
    positionMap[link.target] as DivPosition,
    link.type
  )
  return generateLinkPoints(start, end)
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
