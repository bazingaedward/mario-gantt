import type { DivPosition, Point, Scale } from '@/typing'
import { LINK_OFFSET, LINK_SVG_TRIANGLE, TIME_SCALE_ROW_HEIGHT } from './constant'
import { format, add, isBefore, parse } from 'date-fns'
import { LinkType } from './enum'

/**
 * 基于元素的宽高绘制背景网格
 * @param width
 * @param height
 * @returns
 */
export interface DrawGridOptions {
  /**
   * 单元格宽度,单位px
   */
  cellWidth: number
  /**
   * 单元格高度,单位px
   */
  cellHeight: number
  /**
   * 边框颜色，eg：'#ebebeb'
   */
  borderColor?: string
  /**
   * 水平的网格点
   */
  rowGridNum?: number
  /**
   * 垂直的网格点
   */
  colGridNum?: number
}
export function drawGridBackgroundImage({
  cellWidth,
  cellHeight,
  rowGridNum = 30,
  colGridNum = 10,
  borderColor = '#ebebeb'
}: DrawGridOptions) {
  // 创建一个新的画布，用于绘制 DOM 元素
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = cellWidth * rowGridNum
  tempCanvas.height = cellHeight * colGridNum

  const ctx = tempCanvas.getContext('2d') as CanvasRenderingContext2D

  // 设置网格线的样式
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 1

  // 绘制水平线
  for (let y = 0; y <= tempCanvas.height; y += cellHeight) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(tempCanvas.width, y)
    ctx.stroke()
  }

  // 绘制垂直线
  for (let x = 0; x <= tempCanvas.width; x += cellWidth) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, tempCanvas.height)
    ctx.stroke()
  }

  // 设置画布尺寸

  // 在画布上绘制 DOM 元素
  // tempContext.drawSvg(element.outerHTML, 0, 0, width, height);

  // 将绘制结果转换为 base64 图片
  return tempCanvas.toDataURL('image/png')
}

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
 * @param start 起始点
 * @param end 结束点
 * @param type 首尾连接类型
 * @returns
 */
export const generateLinkPoints = (start: Point, end: Point, type = 0) => {
  const points: Point[] = [start]

  const isRightTriangle = [0, 1].includes(type)
  const triangleOffset = {
    x: (isRightTriangle ? 1 : -1) * LINK_SVG_TRIANGLE.offsetX,
    y: (isRightTriangle ? 1 : -1) * LINK_SVG_TRIANGLE.offsetY
  }

  if (type === LinkType.FinishToStart) {
    if (start.x + LINK_OFFSET > end.x - LINK_OFFSET) {
      // 生成S型路径
      points.push({ x: start.x + LINK_OFFSET, y: start.y })
      points.push({ x: start.x + LINK_OFFSET, y: Math.round((start.y + end.y) / 2) })
      points.push({ x: end.x - LINK_OFFSET, y: Math.round((start.y + end.y) / 2) })
      points.push({ x: end.x - LINK_OFFSET, y: end.y })
    } else {
      // 生成Z字型路径
      points.push({ x: start.x + LINK_OFFSET, y: start.y })
      points.push({ x: start.x + LINK_OFFSET, y: end.y })
    }
  }

  if (type === LinkType.StartToStart) {
    if (start.x > end.x) {
      // 生成Z字型路径
      points.push({ x: end.x - LINK_OFFSET, y: start.y })
      points.push({ x: end.x - LINK_OFFSET, y: end.y })
    } else {
      // 生成S型路径
      points.push({ x: start.x - LINK_OFFSET, y: start.y })
      points.push({ x: start.x - LINK_OFFSET, y: end.y })
    }
  }

  if (type === LinkType.FinishToFinish) {
    if (start.x > end.x) {
      points.push({ x: start.x + LINK_OFFSET, y: start.y })
      points.push({ x: start.x + LINK_OFFSET, y: end.y })
    } else {
      points.push({ x: end.x + LINK_OFFSET, y: start.y })
      points.push({ x: end.x + LINK_OFFSET, y: end.y })
    }
  }

  if (type === LinkType.StartToFinish) {
    if (start.x - LINK_OFFSET < end.x + LINK_OFFSET) {
      // 生成S型路径
      points.push({ x: start.x - LINK_OFFSET, y: start.y })
      points.push({ x: start.x - LINK_OFFSET, y: Math.round((start.y + end.y) / 2) })
      points.push({ x: end.x + LINK_OFFSET, y: Math.round((start.y + end.y) / 2) })
    } else {
      // 生成Z字型路径
      points.push({ x: start.x - LINK_OFFSET, y: start.y })
      points.push({ x: start.x - LINK_OFFSET, y: end.y })
    }

    points.push({ x: end.x + LINK_OFFSET, y: end.y })
  }

  // 生成三角形箭头
  points.push({ x: end.x, y: end.y })
  points.push({ x: end.x - triangleOffset.x, y: end.y - triangleOffset.y })
  points.push({ x: end.x - triangleOffset.x, y: end.y + triangleOffset.y })
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
