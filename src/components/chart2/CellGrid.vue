<template>
  <div :style="cellStyle"></div>
</template>

<script setup>
import { computed } from 'vue'
import { grid } from '@dhtmlx/trial-lib-gantt'

const props = defineProps(['width', 'height', 'borders'])

const cellStyle = computed(() => {
  const img = grid(props.width, props.height, '#ebebeb', props.borders)
  return {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${img})`
  }
})
</script>
