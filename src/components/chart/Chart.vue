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
      <CellGrid :width="cellWidth" :height="props.cellHeight" :borders="borders" />

      <div v-if="selected" class="selection" :style="selectStyle"></div>

      <Links :links="links" :width="fullWidth" :height="fullHeight" />

      <Bars
        :tasks="tasks"
        :cellWidth="cellWidth"
        :drag="drag"
        :newLink="newLink"
        @action="action"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
import CellGrid from './CellGrid.vue'
import Links from './Links.vue'
import Bars from './Bars.vue'

// 定义props
const props = defineProps([
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
  'borders'
])
console.log(props, 112)

const emit = defineEmits(['action'])

const chart = ref({})

const dataRequest = () => {
  const clientHeight = chart.value.clientHeight || 0
  const num = Math.ceil(clientHeight / props.cellHeight) + 1
  const pos = Math.floor(chart.value.scrollTop / props.cellHeight)
  const start = Math.max(0, pos)
  const end = pos + num
  const from = start * props.cellHeight
  emit('action', { action: 'data-request', start, end, from })
}

const action = (data) => {
  emit('action', data)
}

const scroll = () => {
  emit('action', {
    action: 'scroll-chart',
    top: props.scrollTop,
    left: props.scrollLeft
  })
  dataRequest()
}

const scrollToTask = (task) => {
  if (task) {
    const { clientWidth, clientHeight } = chart.value
    let left = props.scrollLeft
    let top = props.scrollTop

    if (task.$x <= left) {
      left = task.$x - cellWidth
    } else if (task.$x + task.$w >= clientWidth + left && task.$w < clientWidth) {
      left = task.$x + task.$w - clientWidth + cellWidth
    } else if (task.$w > clientWidth) {
      left = task.$x - cellWidth
    }

    if (task.$y < top) {
      top = task.$y - props.cellHeight
    } else if (task.$y + task.$h >= clientHeight + top) {
      top = task.$y - clientHeight + props.cellHeight
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
  chart.value.scrollTop = props.scrollTop
  chart.value.scrollLeft = props.scrollLeft

  if (props.scrollTop !== chart.value.scrollTop) {
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
    width: `${props.fullWidth}px`,
    height: `${props.fullHeight}px`
  }
})

const markersHeight = computed(() => {
  return props.fullHeight > chart.value.clientHeight ? chart.value.clientHeight : props.fullHeight
})

const markersStyle = computed(() => {
  return {
    height: `${markersHeight.value}px`,
    left: `${-scrollLeft}px`
  }
})

const selectStyle = computed(() => {
  return {
    height: props.cellHeight - 1 + 'px',
    top: props.selected.$y - 3 + 'px'
  }
})

watch(
  () => props.selected,
  (selected) => {
    if (selected) {
      scrollToTask(selected)
    }
  }
)

watch(
  () => props.cellHeight,
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
