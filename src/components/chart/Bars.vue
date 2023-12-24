<template>
  <div
    class="bars"
    ref="layer"
    :style="lineHeight"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mousemove="mousemove"
    @mouseenter="mouseEnter"
  >
    <div
      v-for="task in tasks"
      :key="task.id"
      :class="['bar', task.type || 'task']"
      :style="taskStyle(task)"
      :data-id="task.id"
      :data-type="task.type"
      :data-tooltip-id="task.id"
      @mouseover="(e) => onDomHover(task, e)"
      @mouseleave="onDomLeave"
    >
      <div class="link left"></div>
      <div class="control left"></div>

      <template v-if="task.type !== 'milestone'">
        <div v-if="task.progress" class="progress-wrapper">
          <div class="progress-percent" :style="{ width: task.progress + '%' }" />
        </div>

        <div v-if="task.textLeft" class="textLeft">{{ task.textLeft }}</div>
        <div v-if="task.textRight" class="  ">{{ task.textRight }}</div>

        <div v-else class="text">{{ task.text }}</div>
      </template>

      <template v-else>
        <div class="content"></div>
        <div class="textRight">{{ task.text || task.textRight }}</div>
      </template>

      <div class="gantt_task_progress_drag" :style="taskProgressStyle(task)"></div>
      <div class="control right"></div>
      <div class="link right"></div>
    </div>

    <NewLink
      v-if="state.start && state.end && newLink"
      :layer="layer"
      :start="state.start"
      :end="state.end"
    />
  </div>
  <div id="tooltip" class="tooltip-dom">{{ tooltipInfo?.id }}</div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, inject } from 'vue'
import { debounce, isNil } from 'lodash-es'
import NewLink from './NewLink.vue'
import { locateID, locate } from '@/utils'
import { useBarMouseEvent } from './hooks'
import { createPopper } from '@popperjs/core'
import type { TaskItem } from '@/typing'

const positionMap = inject('positionMap', {})
const props = defineProps(['tasks', 'drag', 'newLink', 'cellWidth'])
const emit = defineEmits(['action'])

const layer = ref(null)
const test = ref(null)
const popperInstance = ref(null)

const onAddLink = (obj: Object) => {
  emit('action', {
    action: 'add-link',
    obj
  })
}
const { mousedown, mousemove, mouseup, mouseEnter, state } = useBarMouseEvent(
  props.cellWidth,
  onAddLink,
  test
)
const tooltipInfo = ref(null)

const t = debounce((task, e) => {
  console.log(task, e, 112)
  // (e) => console.log(e, task)
})

// TODO: 定位callback
const onDomHover = debounce((task: TaskItem, e: MouseEvent) => {
  const taskDom = locate(e)
  if (popperInstance.value) {
    popperInstance.value?.update()
  } else {
    tooltipInfo.value = task
    const tooltip = document.querySelector('#tooltip')
    popperInstance.value = createPopper(taskDom, tooltip, {
      placement: 'bottom', // 设置 Tooltip 的位置，可以是 'top', 'bottom', 'right', 'left' 等
      modifiers: {
        // offset: {
        //   offset: '0, 10' // 设置 Tooltip 的偏移量
        // }
      }
    })
  }
})

const onDomLeave = debounce((e: MouseEvent) => {
  if (popperInstance.value) {
    popperInstance.value?.destroy()
    popperInstance.value = null
  } else {
  }
})

function taskStyle(task) {
  const attr = positionMap[task.id]
  if (isNil(attr)) return ''

  return `left:${attr.$x}px;top:${attr.$y}px;width:${attr.$w}px;height:${attr.$h}px`
}

function taskProgressStyle(task) {
  const attr = positionMap[task.id]
  if (isNil(attr)) return ''

  return `left:${attr.$w * (task.progress / 100)}px`
}

const lineHeight = computed(() => {
  return `line-height: ${props.tasks.length ? props.tasks[0].$h : 0}px`
})
</script>

<style scoped lang="less">
.test {
  color: black;
  position: absolute;
  left: 200px;
  top: 200px;
}
#tooltip {
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 13px;
  position: absolute;
  left: -200px;
  top: -200px;
}
.bars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bar {
  box-sizing: border-box;
  position: absolute;
  border-radius: var(--wx-gantt-bar-border-radius);
  font: var(--wx-gantt-bar-font);
  white-space: nowrap;
  line-height: inherit;
  text-align: center;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  .control {
    width: 20px;
    height: 38px;
    position: absolute;
    z-index: 1;
    top: 0;

    &.left {
      left: 0;

      &:hover {
        cursor: w-resize;
      }
    }

    &.right {
      right: 0;
      &:hover {
        cursor: e-resize;
      }
    }
  }

  .gantt_task_progress_drag {
    bottom: -4px;
    height: 10px;
    margin-left: -8px;
    width: 16px;
    background-position: bottom;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkY3Rjk0RUVDMkYzMTFFMkI1OThEQTA3ODU0OTkzMEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkY3Rjk0RUZDMkYzMTFFMkI1OThEQTA3ODU0OTkzMEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyRjdGOTRFQ0MyRjMxMUUyQjU5OERBMDc4NTQ5OTMwQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyRjdGOTRFREMyRjMxMUUyQjU5OERBMDc4NTQ5OTMwQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PobPBzIAAADkSURBVHjaYpk2bRoDDsAExL1QdjEQ/8OmiAWHZk4gXqymqhQM4ty6fU8OSMUA8XdiDBAB4k0a6iqWRga6EKcwMQXduHlnL5DpB8Rv0J2JDFSA+JiOtgZcMwiA2CAxkBxUDVYDLEAKgIpV9XQ0MZwFEgPJAZnHoWpRDAgC4n2W5saiQKfjClQGkBxQDciL+6B6wAbkA/EqJwdrTkUFOQZCAKQGpBbIXA3SCzJggo+XK7OEuBgDsQCkFqgHrBfsBT5eHgZSAUwP2IBfv36TbABMDygdtK1Zv6UESLORaAbIhG6AAAMAKN8wE24DXWcAAAAASUVORK5CYII=);
    background-repeat: no-repeat;
    z-index: 1;
    position: absolute;
    cursor: ew-resize;
  }
}

.bar.touch {
  opacity: 0.5;
}

.task {
  border: 1px solid var(--wx-gantt-task-border-color);
  border-color: var(--wx-gantt-task-border-color);
  color: var(--wx-gantt-task-font-color);
  background-color: var(--wx-gantt-task-color);
}

.project {
  border: 1px solid var(--wx-gantt-project-border-color);
  border-color: var(--wx-gantt-project-border-color);
  color: var(--wx-gantt-project-font-color);
  background-color: var(--wx-gantt-project-color);
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
}

.text {
  position: relative;
  z-index: 2;
  display: inline;
  line-height: 30px;
}

.textRight,
.textLeft {
  position: absolute;
  line-height: normal;
  display: block;
  left: 100%;
  color: var(--wx-font-color);
  pointer-events: none;
  padding: 0 10px;
}
.textLeft {
  left: auto;
  right: 100%;
}

.milestone .textRight {
  padding: 0;
}

.milestone .content {
  height: 100%;
  background-color: var(--wx-gantt-milestone-color);
  transform: rotate(45deg) scale(0.75);
}

.progress-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-radius: var(--wx-gantt-bar-border-radius);
  overflow: hidden;
}

.progress-percent {
  height: 100%;
}

.task .progress-percent {
  background-color: var(--wx-gantt-task-fill-color);
}

.project .progress-percent {
  background-color: var(--wx-gantt-project-fill-color);
}

.link {
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #929292;
  background-color: #f0f0f0;
  cursor: pointer;
  user-select: none;
  opacity: 0;
}

.link.left {
  left: -20px;
}

.link.right {
  right: -20px;
}

.bar:hover .link,
.link:hover {
  opacity: 1;
}

.milestone .link.left {
  left: -16px;
}
.milestone .link.right {
  right: -16px;
}
</style>
