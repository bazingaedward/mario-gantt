import { locate } from '@/utils'
import { createPopper } from '@popperjs/core'
import { inject, reactive, toValue, type Ref } from 'vue'

export const useBarMouseEvent = (
  cellWidth: number,
  onAddLink: (e: { id: number; position: number }) => void,
  barRef: Ref
) => {
  const positionMap = inject('positionMap', {})
  const tasks = inject('tasks', [])
  const { updateTaskProgress } = inject('actions', {})
  const state = reactive({
    taskMove: null,
    layer: null,
    start: null,
    end: null,
    ignoreNextClick: false,
    touched: null,
    touchTimer: null,
    progressMove: null
  })

  function getMoveMode(node, e) {
    // if (getTask(node.dataset.id).type === 'milestone') return ''

    const rect = node.getBoundingClientRect()
    const p = (e.clientX - rect.left) / rect.width
    let delta = 0.2 / (rect.width > 200 ? rect.width / 200 : 1)

    if (p < delta) return 'start'
    if (p > 1 - delta) return 'end'
    return 'move'
  }

  function mousedown(e: MouseEvent) {
    const node = locate(e)
    const target = e.target
    if (!node) return
    const { clientX, clientY } = e
    const id = node.dataset.id
    const css = target?.classList || ''

    if (css.contains('link')) {
      // 边上点的点击
      state.start = {
        id,
        start: css.contains('left'),
        x: clientX,
        y: clientY
      }
    } else if (css.contains('gantt_task_progress_drag')) {
      // progress调整
      const task = tasks.value.find((i) => i.id == id)

      state.progressMove = {
        id,
        x: clientX,
        l: parseInt(e.target.style.left),
        node: e.target,
        progress: task?.progress
      }
    } else {
      // bar move
      // mode=start: 调整左侧位置
      // mode=end: 调整右侧位置
      // mode=move: 调整bar位置
      let mode = getMoveMode(node, e)

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
  }

  function mousemove(e: MouseEvent) {
    const point = e
    const { clientX, clientY } = point
    if (state.start) {
      state.end = { x: clientX, y: clientY }
    } else if (state.taskMove) {
      const { node, mode, l, w, x, id } = state.taskMove
      const dx = (state.taskMove.dx = clientX - x)

      if (!state.start && Math.abs(dx) < 20) return

      if (mode === 'start') {
        node.style.left = `${l + dx}px`
        node.style.width = `${w - dx}px`
        positionMap[id].$x = l + dx
        positionMap[id].$w = w - dx
      } else if (mode === 'end') {
        node.style.width = `${w + dx}px`
        positionMap[id].$w = w + dx
      } else if (mode === 'move') {
        node.style.left = `${l + dx}px`
        positionMap[id].$x = l + dx
      }

      // state.taskMove.start = true

      // 同步位置更新：links
    } else if (state.progressMove) {
      const { id, x, l, node, progress } = state.progressMove
      const dx = point.clientX - x
      // 修改progress 三角node节点的left style
      node.style.left = `${l + dx}px`

      const diffPercent = Math.round((dx / positionMap[id].$w) * 100)
      updateTaskProgress(id, progress + diffPercent)
      // 更新task的progress
      //   const mnode = locate(e)
      //   if (mnode) {
      //     const mode = getMoveMode(mnode, point)
      //     mnode.style.cursor = mode ? 'col-resize' : 'pointer'
      //   }
    }
  }

  function mouseup(e: MouseEvent) {
    const point = e
    if (state.start) {
      const { clientX, clientY } = point

      const source = state.start.id
      const fromStart = state.start.start
      state.start = state.end = null

      const targetNode = document.elementFromPoint(clientX, clientY)
      const node = locate({ target: targetNode })
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
      onAddLink({ source: parseInt(source), target: parseInt(target), type })
      //   emit('action', {
      //     action: 'add-link',
      //     obj: { source: parseInt(source), target: parseInt(target), type }
      //   })
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
      //   emit('action', {
      //     action: 'update-task-time',
      //     id,
      //     obj: { mode, time }
      //   })
      state.ignoreNextClck = true
    } else if (state.progressMove) {
      state.progressMove = null
    }
  }

  function mouseEnter(e: MouseEvent) {
    // 初始化popperInstance
    // popperInstance.update()
  }

  //   function click(e) {
  //     if (state.ignoreNextClick) {
  //       state.ignoreNextClick = true
  //       return
  //     }

  //     const id = locateID(e.target)

  //     if (id) {
  //       emit('action', { action: 'select-task', id })
  //     }
  //   }

  return {
    mousedown,
    mousemove,
    mouseup,
    mouseEnter,
    state
  }
}
