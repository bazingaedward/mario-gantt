<template>
  <div :class="['sidebar', { compact: compactMode }]">
    <div class="header">
      <div class="icon-close" @click="hide"></div>
      <div class="buttons">
        <Button @click="hide"> {{ t('gantt', 'Save') }} </Button>
        <Button appearance="danger" @click="remove">
          {{ t('gantt', 'Delete') }}
        </Button>
      </div>
    </div>
    <div class="body">
      <component
        v-if="template"
        :is="templates.sidebarForm"
        :task="task"
        :linksData="linksData"
        @action="action"
      ></component>

      <template v-else>
        <Text
          :label="t('gantt', 'Name')"
          :value="task.text"
          :autofocus="true"
          @change="(v) => update('text', v)"
        />

        <Textarea
          :label="t('gantt', 'Type')"
          :value="task.details"
          @change="(v) => update('details', v)"
        />

        <Select
          v-if="taskTypes.length > 1"
          :label="t('gantt', 'Type')"
          :value="task.type"
          :options="taskTypes"
          @change="(v) => update('type', v)"
        />

        <Datepicker
          :label="t('gantt', 'Start Date')"
          :value="task.start_date"
          :readonly="true"
          @change="(v) => update('start_date', v)"
        />

        <template v-if="!milestone">
          <Datepicker
            :label="t('gantt', 'End Date')"
            :value="task.end_date"
            :readonly="true"
            @change="(v) => update('end_date', v)"
          />

          <Counter
            :label="t('gantt', 'Duration')"
            :value="task.duration"
            @change="(v) => update('duration', v)"
          />

          <Slider
            :label="`${t('gantt', 'Progress')}: ${task.progress}%`"
            :value="task.progress"
            @change="(v) => update('progress', v)"
          />
        </template>

        <Links :linksData="linksData" @action="action" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { getDiffer, getAdder } from '@dhtmlx/trial-lib-gantt'
import Button from '../../wx/Button.vue'
import Text from '../../wx/Text.vue'
import Select from '../../wx/Select.vue'
import Textarea from '../../wx/Textarea.vue'
import Slider from '../../wx/Slider.vue'
import Datepicker from '../../wx/Datepicker.vue'
import Counter from '../../wx/Counter.vue'
import Links from './Links.vue'

import { LocaleContext } from '@/wx/locale'
import {
  inject,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  onUpdated,
  computed,
  watch
} from 'vue'

const addDay = getAdder('day')
const diffDay = getDiffer('day')

const props = defineProps(['compactMode', 'taskTypes', 'templates', 'task', 'links', 'tasksMap'])
const emit = defineEmits(['action'])

const t = inject(LocaleContext).__

function hide() {
  emit('action', { action: 'hide-details' })
}

function remove() {
  emit('action', { action: 'delete-task', id: props.task.id })
  emit('action', { action: 'hide-details' })
}

function action(e) {
  emit('action', e)
}

function update(name, value) {
  const { task } = props
  task[name] = value

  switch (name) {
    case 'start_date':
    case 'end_date':
      task.duration = diffDay(task.end_date, task.start_date)
      break

    case 'duration':
      task.duration = value * 1
      task.end_date = addDay(task.start_date, task.duration)
      break
  }

  emit('action', { action: 'update-task', id: task.id, obj: task })
}

const linksData = computed(() => {
  const inLinks = props.links
    .filter((a) => a.target == props.task.id)
    .map((link) => ({ link, task: props.tasksMap[link.source] }))

  const outLinks = props.links
    .filter((a) => a.source == props.task.id)
    .map((link) => ({ link, task: props.tasksMap[link.target] }))

  return [
    { title: t('gantt', 'Predecessors'), data: inLinks },
    { title: t('gantt', 'Successors'), data: outLinks }
  ]
})

const milestone = computed(() => {
  return props.task.type === 'milestone'
})

const template = computed(() => {
  return props.templates && props.templates.sidebarForm
})
</script>

<style scoped>
.sidebar {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  background: #fff;
  box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.sidebar.compact {
  position: absolute;
  width: 100%;
  z-index: 5;
}

.header {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 20px;
  border-bottom: 1px solid var(--wx-border-color);
}

.body {
  flex: 1 1 auto;
  padding: 20px;
  overflow: auto;
}

.icon-close {
  width: 24px;
  height: 27px;
  background: var(--wx-close-sb-icon) center center no-repeat;
  cursor: pointer;
}
</style>
