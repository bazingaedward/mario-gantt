<template>
  <div class="scale" :style="scaleStyle">
    <div v-for="row in scales.rows" :key="row" class="row" :style="{ height: `${row.height}px` }">
      <div v-for="cell in row.cells" :key="cell" class="cell" :style="{ width: `${cell.width}px` }">
        {{ cell.value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['scales', 'scrollLeft'])
const scaleStyle = computed(() => {
  return {
    width: `${props.scales.width}px`,
    left: `${-props.scrollLeft}px`
  }
})
</script>

<style scoped>
.scale {
  position: relative;
  box-shadow: var(--wx-top-shadow);
}

.row {
  box-sizing: border-box;
  display: flex;
  border-bottom: 1px solid var(--wx-border-color);
}

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: var(--wx-timescale-border);
  font: var(--wx-timescale-font);
  text-transform: var(--wx-timescale-text-transform);
  color: var(--wx-timescale-font-color);
}
</style>
