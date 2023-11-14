<template>
  <div
    class="table"
    ref="node"
    :style="{ top: -(scrollTop - scrollDelta) + 'px' }"
    @wheel.passive="wheel"
    @click="click"
    @dblclick="dblclick"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="endScroll"
  >
    <div
      v-for="task in tasks"
      :key="task.id"
      :class="['row', { selected: selected && selected.id == task.id }]"
      :style="{ height: cellHeight + 'px' }"
      :data-id="task.id"
    >
      <div v-for="column in columns" :key="column.name" class="cell" :style="cellStyle(column)">
        <template v-if="column.name === 'text'">
          <div class="content" :style="contentStyle(task)">
            <div class="icon" :class="getIcon(task)" data-action="toggle-task"></div>
            {{ column.template(task) }}
          </div>
        </template>

        <template v-else-if="column.action">
          <span class="add" :data-action="column.action" />
        </template>

        <template v-else>
          {{ column.template(task) }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch, inject, onMounted, reactive } from 'vue'
import { locateID } from '@dhtmlx/trial-lib-gantt'
import { reorder } from './actions/reorder'

const props = defineProps([
  'tasks',
  'columns',
  'cellHeight',
  'scrollTop',
  'scrollDelta',
  'selected'
])

const emit = defineEmits(['action'])

const state = reactive({
  delta: 20,
  touchY: null,
  scroll: true
})

const node = ref(null)

onMounted(() => {
  reorder(node.value, {
    start: (e) => startReorder(e),
    move: (e) => moveReorder(e),
    end: (e) => endReorder(e),
    touchStart: () => endScroll()
  })
})

function click(e) {
  const id = locateID(e)
  if (!id) return

  const action = e.target.dataset.action
  if (action) {
    emit('action', { id, action })
    e.preventDefault()
  } else {
    emit('action', { action: 'select-task', id })
  }
}

function dblclick(e) {
  const id = locateID(e)
  if (id) emit('action', { action: 'show-details', id })
}

function wheel(e) {
  const step = e.deltaMode ? e.deltaY * 18 : e.deltaY
  const top = Math.max(0, props.scrollTop + step)
  emit('action', { action: 'scroll-chart', top })
}

function touchStart(e) {
  state.scroll = true
  state.touchY = e.touches[0].clientY + props.scrollTop
}

function touchMove(e) {
  if (state.scroll) {
    const delta = state.touchY - e.touches[0].clientY
    emit('action', { action: 'scroll-chart', top: delta })
  }
}

function endScroll() {
  state.scroll = false
}

function cellStyle(column) {
  const align = `text-align:${column.align}`
  const width = column.width === '100%' ? `flex:1` : `width:${column.width}`
  return `${width};${align}`
}

function contentStyle(task) {
  return {
    paddingLeft: (task.$level - 1) * state.delta + 'px'
  }
}

function getIcon(task) {
  if (!task.data) return ''
  return task.open ? 'icon-close' : 'icon-open'
}

function startReorder({ id }) {
  id *= 1
  const task = props.tasks.find((a) => a.id === id)
  if (!task) return

  if (task.open) emit('action', { id, action: 'toggle-task' })

  emit('action', { action: 'hide-details' })
}

function moveReorder({ id, top }) {
  emit('action', {
    action: 'move-task',
    id,
    obj: { top: top + props.scrollDelta }
  })
}

function endReorder(result) {
  let id = result.id * 1
  const { before, after } = result
  const target = (before || after) * 1

  if (!target) {
    emit('action', { id, action: 'repaint-task' })
    return
  }

  const mode = before ? 'before' : 'after'

  emit('action', {
    id,
    action: 'reorder-task',
    obj: { id, mode, target }
  })
}
</script>

<style scoped>
.table {
  position: relative;
  width: 100%;
  font: var(--wx-grid-body-font);
  color: var(--wx-grid-body-font-color);
}

.row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: var(--wx-grid-body-row-border);
}

.row.selected {
  background: var(--wx-gantt-select-color);
}

.cell {
  box-sizing: border-box;
  flex: 0 0 auto;
  padding: 0 5px;
  overflow: hidden;
}

.content {
  width: 100%;
  white-space: nowrap;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.icon {
  width: 12px;
  min-width: 12px;
  height: 12px;
  margin: 0 5px;
  pointer-events: none;
}

.icon-close,
.icon-open {
  cursor: pointer;
  pointer-events: auto;
}

.icon-close {
  background: var(--wx-close-btn-icon) center center no-repeat;
}

.icon-open {
  background: var(--wx-open-btn-icon) center center no-repeat;
}

.add {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: var(--wx-add-btn-icon) center center no-repeat;
  opacity: 0.54;
  cursor: pointer;
}

.add:hover {
  opacity: 1;
}

.wx-reorder-card.row {
  width: 100%;
  background: white;
  border-top: var(--wx-grid-body-row-border);
  opacity: 50%;
}

.wx-reorder.row {
  opacity: 50%;
}
</style>
