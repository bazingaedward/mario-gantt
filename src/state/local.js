import { nextTick } from "vue";
import { LocalData, LocalState } from "@dhtmlx/trial-lib-gantt";

export class VueLocalData extends LocalData {
	constructor(vm) {
		super(vm.$emit.bind(vm));
		this._vm = vm;
	}
	updateStore(obj) {
		super.updateStore(obj);
		for (var key in obj) {
			const fullKey = key + "State";
			if (typeof this._vm[fullKey] !== "undefined")
				this._vm[fullKey] = this.state[key];
		}
	}
}

export class VueLocalState extends LocalState {
	constructor(vm) {
		const wrapper = (v, n) => {
			let h = [];
			return {
				set: nv => {
					if (v !== nv) {
						v = vm[n] = nv;
						h.forEach(x => x(nv));
					}
				},
				subscribe: x => {
					h.push(x);
					x(v);
				},
			};
		};
		super(wrapper);
	}
	getValues() {
		const data = super.getState();
		const out = {};
		for (var key in data) data[key].subscribe(v => (out[key] = v));

		return out;
	}
	actions(store, dispatch) {
		return super.actions(store, dispatch, nextTick);
	}
}
