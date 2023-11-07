<template>
	<div :style="cellStyle"></div>
</template>

<script>
	import { grid } from "@dhtmlx/trial-lib-gantt";

	export default {
		props: ["width", "height", "borders"],

		computed: {
			cellStyle() {
				const img = grid(this.width, this.height, "#ebebeb", this.borders);
				return {
					width: "100%",
					height: "100%",
					backgroundImage: `url(${img})`,
				};
			},
		},
	};
</script>
