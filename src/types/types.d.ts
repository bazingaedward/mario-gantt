export declare type MessageSender = (name: string, data: StringHash<any>) => void;
export declare type UpdateHandler = () => void;
export declare type InitConfig = {
    tasks: GanttItem[];
    links: GanttLink[];
    scales: GanttScale[];
    scaleHeight: number;
    cellHeight: number;
    cellWidth: number;
    start?: Date;
    end?: Date;
};
export declare type LocalState = {
    tasksMap: GanttDataMap;
    tasks: GanttItemData[];
    links: GanttLinkData[];
    scales: GanttScaleData;
};
export declare type StoreUpdate = {
    tasksMap?: GanttDataMap;
    tasks?: GanttItemData[];
    links?: GanttLinkData[];
    scales?: GanttScaleData;
};
export interface GanttItem {
    id: number;
    serverId?: number;
    text: string;
    progress: number;
    details?: string;
    duration?: number;
    start_date?: string | Date;
    end_date?: string | Date;
}
export interface GanttItemData extends GanttItem {
    $level: number;
    data: GanttItemData[];
    open: boolean;
    parent: number;
    type?: string;
    start_date?: Date;
    end_date?: Date;
    $x?: number;
    $y?: number;
    $h?: number;
    $w?: number;
}
export interface GanttLink {
    id: number;
    serverId?: number;
    source: number;
    target: number;
    type: number;
}
export interface GanttLinkData extends GanttLink {
    id: number;
    $p?: string;
}
export interface NumericHash<T> {
    [key: number]: T;
}
export interface StringHash<T> {
    [key: string]: T;
}
export declare type GanttDataMap = NumericHash<GanttItemData>;
export declare type GanttScale = {
    unit: string;
    step: number;
    format?: {
        (date: Date, next?: Date): string;
    };
    css?: {
        (date: Date): string;
    };
};
export declare type GanttScaleCell = {
    width: number;
    value: string;
    css: string;
};
export declare type GanttScaleRow = {
    cells: GanttScaleCell[];
    height: number;
    add: any;
};
export declare type GanttScaleData = {
    rows: GanttScaleRow[];
    width: number;
    height: number;
    start: Date;
    end: Date;
    diff: {
        (a: Date, b: Date): number;
    };
};
export declare type GanttColumn = {
    width?: number | string;
    align?: "left" | "right" | "center";
    name?: string;
    action?: string;
    template: {
        (b: GanttItemData): string;
    };
};
