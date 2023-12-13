import type { GanttItemData } from '@/types/types'
import type { TaskItem } from '@/typing'
import type { DrawGridOptions } from '@/utils'
import { differenceInDays, parse } from 'date-fns'
import { ref, computed } from 'vue'
import { reactiveComputed } from '@vueuse/core'
import { isNil } from 'lodash'

/**
 * gantt图内部状态管理
 * @returns
 */
export type GanttStoreOption = {
  start: Date
  end: Date
} & Pick<DrawGridOptions, 'cellHeight' | 'cellWidth'>

export const useGanttStore = ({ start, end, cellHeight, cellWidth }: GanttStoreOption) => {
  const tasks = ref<TaskItem[]>([
    {
      id: 1,
      start_date: new Date('2020-11-06'),
      duration: 3,
      text: 'vue Gantt Widget2',
      progress: 60
    },
    {
      id: 2,
      parent: 1,
      start_date: new Date('2020-11-06'),
      duration: 1,
      text: 'Lib-Gantt',
      progress: 80
    }
  ])

  const positionMap = reactiveComputed(() => {
    return tasks.value.reduce((s, task, taskIdx) => {
      const { id, start_date, duration } = task
      const starDiffDays = differenceInDays(start_date, start)

      if (id) {
        s[id] = {
          $x: (starDiffDays ?? 1) * cellWidth,
          $y: taskIdx * cellHeight + 3,
          $h: cellHeight - 7,
          $w: (duration ?? 1) * cellWidth
        }
      }
      return s
    }, {})
  })

  const updateTaskProgress = (taskId: number, progress: number) => {
    if (isNil(taskId) || isNil(progress)) return
    const idx = tasks.value.findIndex((i) => i.id == taskId)
    if (idx > -1) {
      tasks.value[idx].progress = progress
    }
  }

  return { tasks, positionMap, updateTaskProgress }
}
