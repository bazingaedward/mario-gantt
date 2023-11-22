import { GanttScale, GanttScaleData } from "../types";
export declare function resetScales(start: Date, end: Date, width: number, height: number, scales: GanttScale[]): GanttScaleData;
export declare function grid(width: number, height: number, color: string, mode?: "full"): string;
