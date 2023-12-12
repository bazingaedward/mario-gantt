<template>
  <div :style="cellStyle"></div>
</template>

<script setup lang="ts">
import { computed, toRaw } from 'vue'
import { drawGridBackgroundImage } from '@/utils'

const props = defineProps(['width', 'height', 'borders'])

const cellStyle = computed(() => {
  const img = drawGridBackgroundImage({
    cellHeight: props.height,
    cellWidth: props.width,
    rowGridNum: 30,
    colGridNum: 10
  })
  return {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${img})`
  }
})
</script>
