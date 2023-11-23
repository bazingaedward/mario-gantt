import type { DivPosition, Point, Scale } from '@/typing'
import { TIME_SCALE_ROW_HEIGHT } from './constant'
import { format, add, isBefore, parse } from 'date-fns'
import { LinkType } from './enum'
/**
 * 解析scale列表，生成timescale组件需要的cell数组
 */
export const parseScale = (scales: Scale[], startDate: Date, endDate: Date, options?: any) => {
  const height = scales.length * TIME_SCALE_ROW_HEIGHT
  const rows = scales.map((scale) => {
    // 基于格式生成row对应的所有cell
    const timeSeries = []
    let currentDate = startDate

    // 循环直到达到或超过结束日期
    // TODO: 这里需要动态计算不同timescale坐标轴的宽度和相关关系，先从俭，只显示单行数据
    while (isBefore(currentDate, endDate)) {
      // timeSeries.push(format(currentDate, scale?.format || 'YYYY-MM-DD'))
      timeSeries.push(format(currentDate, 'MM-dd'))

      // 添加时间间隔
      // currentDate = add(currentDate, { [`${scale.unit}s`]: scale.step })
      currentDate = add(currentDate, { [`days`]: scale.step })
    }

    return {
      cells: timeSeries.map((i) => ({
        value: i,
        width: 100
      })),
      height: TIME_SCALE_ROW_HEIGHT
    }
  })

  const width = rows[0].cells.reduce((s, i) => (s += i.width), 0)

  return {
    start: startDate,
    end: endDate,
    rows,
    width,
    height
  }
}

export const locateID = (e: any) => {
  const parent = e.parentElement
  const dataset = parent.dataset
  return dataset?.id
}

/**
 * 返回hover等事件的父级组件，并且必须包含id属性
 * @param e
 * @returns
 */
export const locate = (e: any) => {
  const parent = e?.target?.parentElement
  const dataset = parent?.dataset
  if (dataset?.id) {
    return parent
  }
  return null
}

/**
 * 基于起始结束点生成svg的polygon 点路径
 * @param start
 * @param end
 * @returns
 */
export const generateLinkPoints = (start: Point, end: Point) => {
  const points: Point[] = [start]

  // 生成S型路径
  points.push({ x: start.x + 20, y: start.y })
  points.push({ x: start.x + 20, y: Math.round((start.y + end.y) / 2) })
  points.push({ x: end.x - 20, y: Math.round((start.y + end.y) / 2) })
  points.push({ x: end.x - 20, y: end.y })
  points.push({ x: end.x, y: end.y })

  // 生成三角形箭头
  points.push({ x: end.x - 5, y: end.y - 3 })
  points.push({ x: end.x - 5, y: end.y + 3 })
  points.push({ x: end.x, y: end.y })

  return points.map((i) => `${i.x},${i.y}`).join(' ')
}

/**
 * 基于link的链接类型返回对应的坐标数据
 * @param source
 * @param target
 * @param type
 * @returns
 */
export const getLinkEnds = (source: DivPosition, target: DivPosition, type: number) => {
  switch (type) {
    case LinkType.FinishToStart: {
      return {
        start: {
          x: source.$x + source.$w,
          y: source.$y + 16
        },
        end: {
          x: target.$x,
          y: target.$y + 16
        }
      }
    }
    case LinkType.FinishToFinish: {
      return {
        start: {
          x: source.$x + source.$w,
          y: source.$y + 16
        },
        end: {
          x: target.$x + target.$w,
          y: target.$y + 16
        }
      }
    }
    case LinkType.StartToFinish: {
      return {
        start: {
          x: source.$x,
          y: source.$y + 16
        },
        end: {
          x: target.$x + target.$w,
          y: target.$y + 16
        }
      }
    }
    case LinkType.StartToStart: {
      return {
        start: {
          x: source.$x,
          y: source.$y + 16
        },
        end: {
          x: target.$x,
          y: target.$y + 16
        }
      }
    }
    default: {
      return {
        start: {
          x: source.$x,
          y: source.$y + 16
        },
        end: {
          x: target.$x,
          y: target.$y + 16
        }
      }
    }
  }
}
