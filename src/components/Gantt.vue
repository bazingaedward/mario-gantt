<template>
  <div class="layout">
    <div class="content">
      <TimeScale :scales="scalesState" :scrollLeft="scrollLeft" />

      <Chart
        :drag="!readOnly.noDrag"
        :newLink="!readOnly.noNewLink"
        :markers="markersData"
        :tasks="renderTasks"
        :links="linksState"
        :scrollTop="scrollTop"
        :scrollLeft="scrollLeft"
        :cellWidth="cellWidth"
        :cellHeight="cellHeight"
        :fullWidth="fullWidth"
        :fullHeight="fullHeight"
        :selected="selected"
        :borders="borders"
        @action="action"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw, inject, provide, readonly, getCurrentInstance, computed, reactive } from 'vue'
import Chart from './chart/Chart.vue'
import TimeScale from './TimeScale.vue'
import { VueLocalState, Vue3LocalData } from '../state/local.js'
import en from '../locales/en'
import locale from '@/wx/locales/en'
import { LocaleContext } from '@/wx/locale'
import { parseScale } from '@/utils'

const check = inject(LocaleContext, null)
if (!check) provide(LocaleContext, readonly(locale().extend(en)))

const props = defineProps({
  markers: { type: Array, default: () => [] },
  taskTypes: { type: Array, default: () => ['task', 'milestone'] },
  tasks: { type: Array, default: () => [] },
  links: { type: Array, default: () => [] },
  scales: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  start: { type: Date, default: null },
  end: { type: Date, default: null },
  cellWidth: { type: Number, default: 100 },
  cellHeight: { type: Number, default: 38 },
  scaleHeight: { type: Number, default: 30 },
  readonly: { type: [Boolean, Object], default: false },
  grid: { type: [Boolean, Number], default: true },
  tooltip: { type: Object, default: null },
  borders: { type: String, default: 'full' }
})

const positionMap = reactive({
  1: {
    $x: 100,
    $y: 3,
    $w: 500,
    $h: 31
  },
  2: {
    $x: 100,
    $y: 41,
    $w: 100,
    $h: 31
  }
})

provide('positionMap', positionMap)

// 设置provide状态
provide('tasks', props.tasks)

const instance = getCurrentInstance()
const emit = defineEmits(['store'])
let store = new Vue3LocalData(instance)
let state = new VueLocalState(instance)
let action = () => {}

store.init(props)
const stateValues = state.getValues()
const { scrollTop, from, selected, scrollLeft, details } = stateValues
const tasksState = props.tasks
const linksState = markRaw(store.state.links)
// const scalesState = markRaw(store.state.scales)

const scalesState = parseScale(
  props.scales,
  new Date('2020-11-05T00:00:00.000Z'),
  new Date('2020-12-06T00:00:00.000Z')
)

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
  return tasksState.length * props.cellHeight
})

const renderTasks = computed(() => {
  return tasksState.slice(stateValues.dataStart, 2)
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
