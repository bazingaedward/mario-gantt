import { GanttDataMap, GanttItem, GanttItemData, StringHash } from "../types";
export declare function create(data: GanttItem[]): GanttDataMap;
export declare function toArray(items: GanttDataMap): GanttItemData[];
export declare function update(tree: GanttDataMap, id: number, values: StringHash<any>): GanttDataMap;
export declare function remove(tree: GanttDataMap, id: number): GanttDataMap;
export declare function each(tree: GanttDataMap, cb: (item: GanttItemData) => void): void;
export declare function move(tree: GanttDataMap, id: number, mode: string, target: number): GanttDataMap;
