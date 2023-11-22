import { GanttItemData, GanttLinkData, StringHash, InitConfig, LocalState, MessageSender, StoreUpdate, UpdateHandler, GanttScaleData } from "./types";
export default class LocalStore {
    private _dispatch;
    private _updater;
    private _cache;
    private _base;
    private _data;
    private _autoScale;
    state: LocalState;
    constructor(dispatch?: MessageSender, updater?: UpdateHandler);
    init(config: InitConfig): void;
    calckScales(startPrev: Date, endPrev: Date): GanttScaleData;
    updateScales(): GanttScaleData;
    getTask(id: number): GanttItemData;
    initStore(): void;
    update(obj: StoreUpdate): void;
    updateTask(id: number, obj: any, noSave: boolean): void;
    updateLink(id: number, obj: any, noSave: boolean): void;
    updateStore(obj: StoreUpdate): void;
    dispatch(name: string, data: StringHash<any>, noSave: boolean): void;
    calckTasks(data: GanttItemData[]): GanttItemData[];
    calckLinks(data?: GanttLinkData[]): GanttLinkData[];
    action(id: number, action: string, obj: StringHash<any>, noSave?: boolean): number;
}
