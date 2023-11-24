<template>
  <div
    class="bars"
    ref="layer"
    :style="lineHeight"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mousemove="mousemove"
    @click="click"
    @dragstart="() => false"
  >
    <div
      v-for="task in tasks"
      :key="task.id"
      :class="['bar', task.type || 'task']"
      :style="taskStyle(task)"
      :data-id="task.id"
      :data-type="task.type"
      :data-tooltip-id="task.id"
    >
      <div class="link left"></div>

      <template v-if="task.type !== 'milestone'">
        <div v-if="task.progress" class="progress-wrapper">
          <div class="progress-percent" :style="{ width: task.progress + '%' }" />
        </div>

        <div v-if="task.textLeft" class="textLeft">{{ task.textLeft }}</div>
        <div v-if="task.textRight" class="textRight">{{ task.textRight }}</div>

        <div v-else class="text">{{ task.text }}</div>
      </template>

      <template v-else>
        <div class="content"></div>
        <div class="textRight">{{ task.text || task.textRight }}</div>
      </template>

      <div class="link right"></div>
    </div>

    <NewLink
      v-if="state.start && state.end && newLink"
      :layer="layer"
      :start="state.start"
      :end="state.end"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, inject } from 'vue'
import { isNil } from 'lodash-es'
import NewLink from './NewLink.vue'
import { locateID, locate } from '@/utils'

const positionMap = inject('positionMap', {})

const props = defineProps(['tasks', 'drag', 'newLink', 'cellWidth'])
const emit = defineEmits(['action'])
const layer = ref(null)

const state = reactive({
  taskMove: null,
  layer: null,
  start: null,
  end: null,
  ignoreNextClick: false,
  touched: null,
  touchTimer: null
})

function mousedown(e) {
  const node = locate(e)
  if (!node) return
  const target = e.target
  const point = e
  const { clientX, clientY } = point
  const id = node.dataset.id
  const css = target.classList

  if (css.contains('link')) {
    // 边上点的点击
    state.start = {
      id,
      start: css.contains('left'),
      x: clientX,
      y: clientY
    }
  } else {
    // bar move
    let mode = getMoveMode(node, point) || 'move'

    state.taskMove = {
      id,
      mode,
      node,
      x: clientX,
      dx: 0,
      l: parseInt(node.style.left),
      w: parseInt(node.style.width)
    }
  }
  startDrag()
}

function mousemove(e) {
  const point = e
  const { clientX, clientY } = point
  if (state.start) {
    state.end = { x: clientX, y: clientY }
  } else if (state.taskMove && props.drag) {
    const { node, mode, l, w, x, id } = state.taskMove
    const dx = (state.taskMove.dx = clientX - x)
    if (!state.start && Math.abs(dx) < 20) return
    if (mode === 'start') {
      node.style.left = `${l + dx}px`
      node.style.width = `${w - dx}px`
    } else if (mode === 'end') {
      node.style.width = `${w + dx}px`
    } else if (mode === 'move') {
      node.style.left = `${l + dx}px`
    }

    state.taskMove.start = true

    positionMap[id].$x = parseInt(node.style.left)
  } else {
    const mnode = locate(e)
    if (mnode) {
      const mode = getMoveMode(mnode, point)
      mnode.style.cursor = mode ? 'col-resize' : 'pointer'
    }
  }
}

function mouseup(e) {
  const point = e
  if (state.start) {
    const { clientX, clientY } = point

    const source = state.start.id
    const fromStart = state.start.start
    state.start = state.end = null

    const targetNode = document.elementFromPoint(clientX, clientY)
    const node = locate(targetNode)
    if (!node) return

    const css = node.classList
    const target = node.dataset.id
    if (!target || source == target) return

    let toStart = true
    if (css.contains('link')) {
      if (css.contains('right')) {
        toStart = false
      }
    } else {
      const rect = node.getBoundingClientRect()
      const x = clientX - rect.left
      const w = rect.width
      toStart = x < w / 2
    }

    const type = (fromStart ? 1 : 0) + (toStart ? 0 : 2)
    if (props.newLink) {
      emit('action', {
        action: 'add-link',
        obj: { source, target, type }
      })
    }
    endDrag()
  } else if (state.taskMove) {
    const { id, mode, dx, node, l, w, start } = state.taskMove
    state.taskMove = null

    if (!state.start) return

    const time = Math.round(dx / cellWidth)
    // restore node position
    if (!time) {
      node.style.left = `${l}px`
      node.style.width = `${w}px`
    }
    emit('action', {
      action: 'update-task-time',
      id,
      obj: { mode, time }
    })
    state.ignoreNextClck = true
    endDrag()
  }
}

function click(e) {
  if (state.ignoreNextClick) {
    state.ignoreNextClick = true
    return
  }

  const id = locateID(e.target)

  if (id) {
    emit('action', { action: 'select-task', id })
  }
}

function getMoveMode(node, e) {
  if (getTask(node.dataset.id).type === 'milestone') return ''

  const rect = node.getBoundingClientRect()
  const p = (e.clientX - rect.left) / rect.width
  let delta = 0.2 / (rect.width > 200 ? rect.width / 200 : 1)

  if (p < delta) return 'start'
  if (p > 1 - delta) return 'end'
  return ''
}

function getTask(id) {
  return props.tasks.find((a) => a.id == id)
}

function taskStyle(task) {
  const attr = positionMap[task.id]
  if (isNil(attr)) return ''

  return `left:${attr.$x}px;top:${attr.$y}px;width:${attr.$w}px;height:${attr.$h}px`
}

function startDrag() {
  document.body.style.userSelect = 'none'
}

function endDrag() {
  document.body.style.userSelect = ''
}

const lineHeight = computed(() => {
  return `line-height: ${props.tasks.length ? props.tasks[0].$h : 0}px`
})
</script>

<style scoped>
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
  left: -8px;
}

.link.right {
  right: -8px;
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
