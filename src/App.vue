<script setup lang="ts">
import { Gantt, DefaultTheme, MaterialTheme } from './tt'

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
const scales = [
  { unit: 'month', step: 1, format: 'MMMM yyy' },
  { unit: 'day', step: 1, format: 'd' }
]

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

const links = [{ source: 2, target: 1, type: 0 }]
const links2 = [{ source: 1, target: 2, type: 0 }]
</script>

<template>
  <!-- <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table> -->

  <div style="width: 1256px; height: 1000px">
    <MaterialTheme>
      <Gantt :scales="scales" :columns="columns" :tasks="tasks" :links="links2" />
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
