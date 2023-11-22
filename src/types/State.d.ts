export default class LocalState {
    private _state;
    private _selected;
    private _details;
    constructor(writable: any);
    getState(): any;
    actions(store: any, dispatch: any, tick: any): any;
}
