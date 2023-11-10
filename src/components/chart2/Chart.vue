<template>
  <div class="chart" ref="chart" @scroll="scroll">
    <div v-if="markers.length" class="markers" :style="markersStyle">
      <div
        v-for="(marker, index) in markers"
        :key="index"
        :class="['marker', marker.css || 'default']"
        :style="{ left: marker.left + 'px' }"
      >
        <div class="content">{{ marker.text }}</div>
      </div>
    </div>

    <div class="area" :style="areaStyle">
      <CellGrid :width="cellWidth" :height="cellHeight" :borders="borders" />

      <div v-if="selected" class="selection" :style="selectStyle"></div>

      <Links :links="links" :width="fullWidth" :height="fullHeight" />

      <Bars
        :tasks="tasks"
        :templates="templates"
        :cellWidth="cellWidth"
        :drag="drag"
        :newLink="newLink"
        @action="action"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted, computed, watch } from 'vue'
import CellGrid from './CellGrid'
import Links from './Links'
import Bars from './Bars'

// 定义props
defineProps([
  'drag',
  'newLink',
  'markers',
  'tasks',
  'links',
  'scrollTop',
  'scrollLeft',
  'cellWidth',
  'cellHeight',
  'fullWidth',
  'fullHeight',
  'selected',
  'templates',
  'borders'
])

const emit = defineEmits(['action'])

this.chart = {}

const action = (data) => {
  emit('action', data)
}

const scroll = () => {
  emit('action', {
    action: 'scroll-chart',
    top: this.chart.scrollTop,
    left: this.chart.scrollLeft
  })
  dataRequest()
}

const dataRequest = () => {
  const clientHeight = this.chart.clientHeight || 0
  const num = Math.ceil(clientHeight / this.cellHeight) + 1
  const pos = Math.floor(this.chart.scrollTop / this.cellHeight)
  const start = Math.max(0, pos)
  const end = pos + num
  const from = start * this.cellHeight
  emit('action', { action: 'data-request', start, end, from })
}

const scrollToTask = (task) => {
  if (task) {
    const { clientWidth, clientHeight } = this.chart

    let left = this.scrollLeft
    let top = this.scrollTop

    if (task.$x <= left) {
      left = task.$x - this.cellWidth
    } else if (task.$x + task.$w >= clientWidth + left && task.$w < clientWidth) {
      left = task.$x + task.$w - clientWidth + this.cellWidth
    } else if (task.$w > clientWidth) {
      left = task.$x - this.cellWidth
    }

    if (task.$y < top) {
      top = task.$y - this.cellHeight
    } else if (task.$y + task.$h >= clientHeight + top) {
      top = task.$y - clientHeight + this.cellHeight
    }

    $emit('action', {
      action: 'scroll-chart',
      top,
      left
    })
  }
}

onMounted(() => {
  window.addEventListener('resize', this.dataRequest)
  this.chart = this.$refs.chart
  this.dataRequest()
})

const updated = () => {
  this.chart.scrollTop = this.scrollTop
  this.chart.scrollLeft = this.scrollLeft

  if (this.scrollTop !== this.chart.scrollTop) {
    emit('action', {
      action: 'scroll-chart',
      top: this.chart.scrollTop
    })
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', this.dataRequest)
})

const areaStyle = computed(() => {
  return {
    width: `${this.fullWidth}px`,
    height: `${this.fullHeight}px`
  }
})

const markersHeight = computed(() => {
  return this.fullHeight > this.chart.clientHeight ? this.chart.clientHeight : this.fullHeight
})

const markersStyle = computed(() => {
  return {
    height: `${this.markersHeight}px`,
    left: `${-this.scrollLeft}px`
  }
})

const selectStyle = computed(() => {
  return {
    height: this.cellHeight - 1 + 'px',
    top: this.selected.$y - 3 + 'px'
  }
})

watch('selected', () => {
  if (this.selected) {
    this.scrollToTask(this.selected)
  }
})

watch('cellHeight', () => {
  this.scroll()
})
</script>

<style scoped>
.chart {
  flex: 1 1 auto;
  overflow: auto;
}

.markers {
  position: absolute;
}

.marker {
  position: absolute;
  z-index: 5;
  width: 2px;
  height: 100%;
  text-align: center;
  user-select: none;
  transform: scaleX(-1);
}

.default {
  background-color: var(--wx-gantt-marker-color);
}

.content {
  position: absolute;
  min-width: 80px;
  padding: 4px 8px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  font: var(--wx-gantt-marker-font);
  color: var(--wx-gantt-marker-font-color);
  background-color: inherit;
  white-space: nowrap;
  transform: scaleX(-1);
}

.area {
  position: relative;
}

.selection {
  position: absolute;
  box-sizing: border-box;
  left: 0;
  width: 100%;
  background: var(--wx-gantt-select-color);
}
</style>
