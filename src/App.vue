<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { Gantt, DefaultTheme, MaterialTheme } from './tt'
import type { ActionPayload } from './typing'

const scales = [{ unit: 'day', step: 1, format: 'd' }]

const columns = [
  { name: 'text', label: 'Task name', width: '100%' },
  { name: 'start', label: 'Start time', align: 'center' },
  { name: 'duration', label: 'Duration', width: '70px', align: 'center' },
  { name: 'add-task', label: '', width: '50px', align: 'center' }
]

const tasks = [
  {
    id: 1,
    open: true,
    start_date: '2020-11-06',
    duration: 3,
    text: 'vue Gantt Widget2',
    progress: 60,
    type: 'project'
  },
  {
    id: 2,
    parent: 1,
    start_date: '2020-11-06',
    duration: 1,
    text: 'Lib-Gantt',
    progress: 80
  }
  // {
  //   id: 3,
  //   parent: 1,
  //   text: 'release',
  //   type: 'milestone'
  // }
]

const links = ref([{ source: 1, target: 2, type: 0 }])

const onAction = (payload: ActionPayload) => {
  const { action, obj } = payload
  switch (action) {
    case 'add-link': {
      if (obj) links.value.push(obj)
    }
  }
}
</script>

<template>
  <div style="width: 1256px; height: 1000px">
    <MaterialTheme>
      <Gantt :scales="scales" :columns="columns" :tasks="tasks" :links="links" @action="onAction" />
    </MaterialTheme>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
