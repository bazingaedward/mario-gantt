<template>
  <div class="grid" :style="{ flex: `0 0 ${basis}` }">
    <Header :compactMode="compactMode" :columns="cols" :height="scales.height" @action="action" />

    <Body
      :tasks="tasks"
      :columns="cols"
      :cellHeight="cellHeight"
      :scrollTop="scrollTop"
      :scrollDelta="scrollDelta"
      :selected="selected"
      @action="action"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import Header from './Header.vue'
import Body from './Body.vue'

const showFull = ref(false)
const props = defineProps([
  'compactMode',
  'width',
  'tasks',
  'columns',
  'scales',
  'cellHeight',
  'scrollTop',
  'scrollDelta',
  'selected'
])

const emit = defineEmits(['action'])

function action(ev) {
  const { action } = ev

  switch (action) {
    case 'toggle-grid':
      showFull.value = !showFull.value
      break

    default:
      emit('action', ev)
      break
  }
}

const cols = computed(() => {
  const { compactMode, columns } = props
  return compactMode
    ? [columns[columns.length - 1], ...columns.slice(0, columns.length - 1)]
    : columns
})

const basis = computed(() => {
  return showFull.value ? '100%' : `${props.width}px`
})

watch(
  () => props.compactMode,
  (compactMode) => {
    if (!compactMode) {
      showFull.value = false
    }
  }
)
</script>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-right: 1px solid var(--wx-border-color);
  overflow: hidden;
}
</style>
