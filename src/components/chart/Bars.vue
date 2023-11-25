<template>
  <div
    class="bars"
    ref="layer"
    :style="lineHeight"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mousemove="mousemove"
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
        <div v-if="task.textRight" class="  ">{{ task.textRight }}</div>

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
import { useBarMouseEvent } from './hooks'

const positionMap = inject('positionMap', {})
const props = defineProps(['tasks', 'drag', 'newLink', 'cellWidth'])
const emit = defineEmits(['action'])

const layer = ref(null)

const onAddLink = (obj: Object) => {
  emit('action', {
    action: 'add-link',
    obj
  })
}
const { mousedown, mousemove, mouseup, state } = useBarMouseEvent(props.cellWidth, onAddLink)

function taskStyle(task) {
  const attr = positionMap[task.id]
  if (isNil(attr)) return ''

  return `left:${attr.$x}px;top:${attr.$y}px;width:${attr.$w}px;height:${attr.$h}px`
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
