import { GanttItemData, GanttLinkData } from "types";
export declare const updateLink: (link: GanttLinkData, startTask: GanttItemData, endTask: GanttItemData, height: number) => GanttLinkData;
export declare function placeLink(box: {
    left: number;
    top: number;
}, start: {
    x: number;
    y: number;
}, end: {
    x: number;
    y: number;
}): {
    width: number;
    height: number;
    left: number;
    top: number;
    p: string;
};
