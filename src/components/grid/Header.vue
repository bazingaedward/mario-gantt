<template>
  <div class="table">
    <div class="row" :style="headerStyle">
      <div v-for="column in columns" :key="column.name" class="cell" :style="cellStyle(column)">
        <template v-if="column.action">
          <span v-if="compactMode" class="mdi mdi-menu" @click="toggleGrid"></span>
          <span v-else class="add" @click="addTask"></span>
        </template>
        <template v-else>{{ t('gantt', column.label) }}</template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch, inject } from 'vue'
import { LocaleContext } from '@/wx/locale'

const props = defineProps(['compactMode', 'columns', 'height'])

const emit = defineEmits(['action'])

const t = inject(LocaleContext).__

function cellStyle(column) {
  const align = `text-align:${column.align}`
  const width = column.width === '100%' ? `flex:1` : `width:${column.width}`
  return `${width};${align}`
}

function addTask() {
  emit('action', { action: 'add-task', id: 0 })
}

function toggleGrid() {
  emit('action', { action: 'toggle-grid' })
}

const headerStyle = computed(() => {
  return {
    height: props.height + 'px'
  }
})
</script>

<style scoped>
.table {
  position: relative;
  width: 100%;
  box-shadow: var(--wx-grid-header-shadow);
  background-color: #fff;
  z-index: 1;
}

.row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--wx-border-color);
}

.cell {
  box-sizing: border-box;
  flex: 0 0 auto;
  font: var(--wx-grid-header-font);
  text-transform: var(--wx-grid-header-text-transform);
  color: var(--wx-grid-header-font-color);
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

.mdi-menu {
  cursor: pointer;
  font-size: 20px;
  color: var(--wx-button-primary-color);
}
</style>
