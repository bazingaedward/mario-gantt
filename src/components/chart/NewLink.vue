<template>
	<svg
		class="new"
		:style="`top:${link.top}px;left:${link.left}px`"
		:width="link.width"
		:height="link.height"
	>
		<polyline class="line" :points="link.p" />
	</svg>
</template>

<script>
	import { placeLink } from "@dhtmlx/trial-lib-gantt";

	export default {
		props: ["layer", "start", "end"],

		computed: {
			link() {
				const box = this.layer.getBoundingClientRect();
				const link = placeLink(box, this.start, this.end);
				return link;
			},
		},
	};
</script>

<style scoped>
	.new {
		position: relative;
		pointer-events: none;
	}

	.line {
		stroke: var(--wx-gantt-link-color);
		stroke-width: 2;
		fill: none;
	}
</style>
