<template>
  <Tooltip :content="tooltip" :data="getTooltipData">
    <div class="layout">
      <Grid
        v-if="grid"
        :compactMode="compactMode"
        :width="gridWidth"
        :tasks="renderTasks"
        :columns="columnsData"
        :scales="scalesState"
        :scrollTop="scrollTop"
        :scrollDelta="from"
        :cellHeight="cellHeight"
        :selected="selected"
        @action="action"
      />

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
          :templates="templates"
          :borders="borders"
          @action="action"
        />
      </div>

      <Sidebar
        v-if="details && !readOnly.noEdit"
        :compactMode="compactMode"
        :taskTypes="taskTypes"
        :templates="templates"
        :task="details"
        :links="linksState"
        :tasksMap="tasksMap"
        @action="action"
      />

      <div v-if="compactMode && !details" class="icon">
        <IconButton
          icon="mdi mdi-plus"
          @click="() => action({ action: 'add-task', id: 0 })"
        ></IconButton>
      </div>
    </div>
  </Tooltip>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  markRaw,
  inject,
  provide,
  onBeforeUpdate,
  readonly,
  reactive,
  getCurrentInstance,
  watch,
  onMounted,
  onUnmounted,
  computed,
  ref,
  defineExpose
} from 'vue'
import Grid from './grid/Grid.vue'
import Chart from './chart/Chart.vue'
import Sidebar from './sidebar/Sidebar.vue'
import TimeScale from './TimeScale.vue'
import Tooltip from '@/wx/Tooltip.vue'
import IconButton from '@/wx/IconButton.vue'
import { VueLocalData, VueLocalState, Vue3LocalData } from '../state/local.js'
import { normalizeColumns } from '@dhtmlx/trial-lib-gantt'
import en from '../locales/en'
import locale from '@/wx/locales/en'
import { LocaleContext } from '@/wx/locale'

const check = inject(LocaleContext, null)
if (!check) provide(LocaleContext, readonly(locale().extend(en)))

const props = defineProps({
  templates: { type: Object, default: () => {} },
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
const instance = getCurrentInstance()
const emit = defineEmits(['store'])
let store = new Vue3LocalData(instance)
let state = new VueLocalState(instance)
let action = () => {}

onBeforeUpdate(() => {
  store = new VueLocalData(instance)
  store.init(props)

  state = new VueLocalState(instance)
  action = state.actions(store, instance.emit)
})

emit('store', store)
store.init(props)
const stateValues = state.getValues()
const { scrollTop, from, selected, scrollLeft } = stateValues

const columnsData = normalizeColumns(props.columns)
const tasksState = markRaw(store.state.tasks)
const linksState = markRaw(store.state.links)
const scalesState = markRaw(store.state.scales)
let tasksMap = markRaw(store.state.tasksMap)
const compactWidth = 650
const compactMode = ref(true)
const ro = ref(null)

watch(
  () => props.cellWidth,
  () => {
    store.init(props)
  }
)

watch(
  () => props.cellHeight,
  () => {
    store.init(props)
  }
)

watch(
  () => props.cellHeight,
  () => {
    store.init(props)
  }
)

watch(
  () => props.scaleHeight,
  () => {
    store.init(props)
  }
)

watch(
  () => props.tasks,
  () => {
    store.init(props)
    console.log(store, 11)
    tasksMap = store.state.tasksMap
  }
)

function getTooltipData(id) {
  return store.getTask(id)
}

function resize(data) {
  compactMode.value = data[0].contentRect.width <= compactWidth
}

onMounted(() => {
  ro.value = new ResizeObserver(resize)
  ro.value.observe(document.body)
})

onUnmounted(() => {
  ro.value.disconnect()
})

const gridWidth = computed(() => {
  return compactMode.value ? 50 : props.grid.width || 400
})

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
  return tasksState.slice(stateValues.dataStart, stateValues.dataEnd)
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
../grid/Grid.vue
