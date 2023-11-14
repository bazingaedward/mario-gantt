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
import {
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  onUpdated,
  computed,
  watch,
  ref
} from 'vue'
import CellGrid from './CellGrid'
import Links from './Links'
import Bars from './Bars'

// 定义props
const {
  cellHeight,
  cellWidth,
  fullHeight,
  fullWidth,
  scrollTop,
  scrollLeft,
  selected,
  templates,
  borders
} = defineProps([
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

const chart = ref({})

const dataRequest = () => {
  const clientHeight = chart.value.clientHeight || 0
  const num = Math.ceil(clientHeight / cellHeight) + 1
  const pos = Math.floor(chart.value.scrollTop / cellHeight)
  const start = Math.max(0, pos)
  const end = pos + num
  const from = start * cellHeight
  emit('action', { action: 'data-request', start, end, from })
}

const action = (data) => {
  emit('action', data)
}

const scroll = () => {
  emit('action', {
    action: 'scroll-chart',
    top: scrollTop,
    left: scrollLeft
  })
  dataRequest()
}

const scrollToTask = (task) => {
  if (task) {
    const { clientWidth, clientHeight } = chart.value
    let left = scrollLeft
    let top = scrollTop

    if (task.$x <= left) {
      left = task.$x - cellWidth
    } else if (task.$x + task.$w >= clientWidth + left && task.$w < clientWidth) {
      left = task.$x + task.$w - clientWidth + cellWidth
    } else if (task.$w > clientWidth) {
      left = task.$x - cellWidth
    }

    if (task.$y < top) {
      top = task.$y - cellHeight
    } else if (task.$y + task.$h >= clientHeight + top) {
      top = task.$y - clientHeight + cellHeight
    }

    emit('action', {
      action: 'scroll-chart',
      top,
      left
    })
  }
}

onMounted(() => {
  window.addEventListener('resize', dataRequest)
  dataRequest()
})

onUpdated(() => {
  chart.value.scrollTop = scrollTop
  chart.value.scrollLeft = scrollLeft

  if (scrollTop !== chart.value.scrollTop) {
    emit('action', {
      action: 'scroll-chart',
      top: chart.value.scrollTop
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', dataRequest)
})

const areaStyle = computed(() => {
  return {
    width: `${fullWidth}px`,
    height: `${fullHeight}px`
  }
})

// const markersHeight = computed(() => {
//   return fullHeight > chart.value.clientHeight ? chart.value.clientHeight : fullHeight
// })

const markersStyle = computed(() => {
  return {
    height: `${markersHeight}px`,
    left: `${-scrollLeft}px`
  }
})

const selectStyle = computed(() => {
  return {
    height: cellHeight - 1 + 'px',
    top: selected.$y - 3 + 'px'
  }
})

watch(
  () => selected,
  () => {
    if (selected) {
      scrollToTask(selected)
    }
  }
)

watch(
  () => cellHeight,
  () => {
    scroll()
  }
)
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
