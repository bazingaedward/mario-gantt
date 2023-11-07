import { provide, readonly } from "vue";
import { LocaleContext } from "./locale";
import locale from "./locales/cn";

export default {
	setup(props) {
		if (props.words)
			provide(LocaleContext, readonly(locale().extend(props.words)));
		else provide(LocaleContext, readonly(locale()));
	},
	props: ["words"],
	render() {
		return this.$slots.default();
	},
};
