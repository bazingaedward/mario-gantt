<template>
  <div class="layout">
    <div class="content">
      <TimeScale :scales="scalesState" :scrollLeft="scrollLeft" />

      <Chart
        :drag="!readOnly.noDrag"
        :newLink="!readOnly.noNewLink"
        :markers="markersData"
        :tasks="renderTasks"
        :scrollTop="scrollTop"
        :scrollLeft="scrollLeft"
        :cellWidth="cellWidth"
        :cellHeight="cellHeight"
        :fullWidth="fullWidth"
        :fullHeight="fullHeight"
        :selected="selected"
        :borders="borders"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  markRaw,
  inject,
  provide,
  readonly,
  getCurrentInstance,
  computed,
  reactive,
  toRaw,
  ref,
  watch,
  toValue
} from 'vue'
import Chart from './chart/Chart.vue'
import TimeScale from './TimeScale.vue'
import en from '../locales/en'
import locale from '@/wx/locales/en'
import { LocaleContext } from '@/wx/locale'
import { parseScale } from '@/utils'
import type { ActionPayload } from '@/typing'
import { useGanttStore } from '@/stores/gantt'

const check = inject(LocaleContext, null)
if (!check) provide(LocaleContext, readonly(locale().extend(en)))

const props = defineProps({
  markers: { type: Array, default: () => [] },
  taskTypes: { type: Array, default: () => ['task', 'milestone'] },
  tasks: { type: Array, default: () => [] },
  links: { type: Array, default: () => [] },
  scales: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  // start: { type: Date, default: null },
  // end: { type: Date, default: null },
  cellWidth: { type: Number, default: 100 },
  cellHeight: { type: Number, default: 38 },
  scaleHeight: { type: Number, default: 30 },
  readonly: { type: [Boolean, Object], default: false },
  grid: { type: [Boolean, Number], default: true },
  tooltip: { type: Object, default: null },
  borders: { type: String, default: 'full' }
})

const start = new Date('2020-11-05')
const end = new Date('2020-12-06')

const { positionMap, tasks, updateTaskProgress } = useGanttStore({
  cellWidth: props.cellWidth,
  cellHeight: props.cellHeight,
  start,
  end
})
// 提供bar位置的map表
provide('positionMap', toValue(positionMap))
// 设置provide状态
provide('tasks', tasks)
// 提供links的数组
provide('links', props.links)
provide('actions', {
  updateTaskProgress
})

// TODO: 定义组件的emit事件
// const emit = defineEmits(['action'])

const scrollTop = 0,
  scrollLeft = 0,
  selected = null

const scalesState = parseScale(props.scales, new Date(start), new Date(end))

const readOnly = computed(() => {
  const { readonly } = props
  if (typeof readonly === 'object') return readonly

  return {
    noDrag: readonly,
    noEdit: readonly,
    noNewLink: readonly
  }
})

const fullWidth = computed(() => {
  return scalesState.width
})

const fullHeight = computed(() => {
  return tasks.value.length * props.cellHeight
})

const renderTasks = computed(() => {
  return toValue(tasks)
})

const markersData = computed(() => {
  const { start, diff } = scalesState
  return props.markers.map((marker) => ({
    ...marker,
    left: diff(marker.start, start) * this.cellWidth
  }))
})
</script>

<style scoped>
.layout {
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #fff;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.icon {
  position: absolute;
  right: 25px;
  bottom: 35px;
  z-index: 4;
}
</style>
