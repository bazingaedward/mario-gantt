export interface Scale {
  /**
   * the name of the scale unit. The available values are: "minute", "hour", "day" (default), "week", "quarter", "month", "year".
   */
  unit: string

  /**
   * the step of the time scale (X-Axis), 1 by default.
   */
  step?: number

  /**
   * a function that returns the name of a CSS class that will be applied to the scale units. Takes a date object as a parameter.
   * @param a date that will be checked
   */
  css?(date: Date): any

  /**
   * the format of the scale's labels. If set as a function, expects a date object as a parameter.
   * @param a date that will be converted
   */
  format?: string | ((date: Date) => any)

  /**
   * the format of the scale's labels. If set as a function, expects a date object as a parameter.
   * @param a date that will be converted
   */
  date?: string | ((date: Date) => any)
}

export interface Point {
  x: number
  y: number
}

export interface GanttLink {
  id: number
  serverId?: number
  source: number
  target: number
  type: number
}

export interface DivPosition {
  $x: number
  $y: number
  $h: number
  $w: number
}
