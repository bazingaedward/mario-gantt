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

<script>
import { markRaw, inject, provide, readonly } from 'vue'

import Grid from './grid/Grid.vue'
import Chart from './chart/Chart.vue'
import Sidebar from './sidebar/Sidebar.vue'
import TimeScale from './TimeScale.vue'
import Tooltip from '@/wx/Tooltip.vue'
import IconButton from '@/wx/IconButton.vue'

import { VueLocalData, VueLocalState } from '../state/local.js'
import { normalizeColumns } from '@dhtmlx/trial-lib-gantt'

import en from '../locales/en'
import locale from '@/wx/locales/en'
import { LocaleContext } from '@/wx/locale'

export default {
  name: 'Gantt',
  setup() {
    const check = inject(LocaleContext, null)
    if (!check) provide(LocaleContext, readonly(locale().extend(en)))
  },
  components: {
    Grid,
    Chart,
    Sidebar,
    TimeScale,
    Tooltip,
    IconButton
  },

  props: {
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
  },

  beforeCreate() {
    this.store = new VueLocalData(this)
    this.store.init(this.$props)

    this.state = new VueLocalState(this)
    this.action = this.state.actions(this.store, this.$emit.bind(this))
  },

  data() {
    this.$emit('store', this.store)
    const columnsData = normalizeColumns(this.$props.columns)
    const state = this.store.state
    return {
      tasksState: markRaw(state.tasks),
      linksState: markRaw(state.links),
      scalesState: markRaw(state.scales),
      tasksMap: markRaw(state.tasksMap),

      compactWidth: 650,
      compactMode: true,

      columnsData,
      ...this.state.getValues()
    }
  },

  watch: {
    cellWidth() {
      this.store.init(this.$props)
    },

    cellHeight() {
      this.store.init(this.$props)
    },

    scaleHeight() {
      this.store.init(this.$props)
    },

    tasks() {
      this.store.init(this.$props)
      this.tasksMap = this.store.state.tasksMap
    }
  },

  methods: {
    getTooltipData(id) {
      return this.store.getTask(id)
    },

    resize(data) {
      this.compactMode = data[0].contentRect.width <= this.compactWidth
    }
  },

  mounted() {
    this.ro = new ResizeObserver(this.resize)
    this.ro.observe(document.body)
  },

  unmounted() {
    this.ro.disconnect()
  },

  computed: {
    gridWidth() {
      return this.compactMode ? 50 : this.grid.width || 400
    },

    readOnly() {
      const { readonly } = this
      if (typeof readonly === 'object') return readonly

      return {
        noDrag: readonly,
        noEdit: readonly,
        noNewLink: readonly
      }
    },

    fullWidth() {
      return this.scalesState.width
    },

    fullHeight() {
      return this.tasksState.length * this.cellHeight
    },

    renderTasks() {
      return this.tasksState.slice(this.dataStart, this.dataEnd)
    },

    markersData() {
      const { start, diff } = this.scalesState
      return this.markers.map((marker) => ({
        ...marker,
        left: diff(marker.start, start) * this.cellWidth
      }))
    }
  }
}
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
