<template>
	<svg class="links" :width="width" :height="height">
		<polyline
			class="line"
			v-for="link in links"
			:key="link.id"
			:points="link.$p"
		/>
	</svg>
</template>

<script>
	export default {
		props: ["links", "width", "height"],
	};
</script>

<style scoped>
	.links {
		position: absolute;
		top: 0;
		left: 0;
	}

	.line {
		user-select: auto;
		pointer-events: stroke;
		position: relative;
		cursor: pointer;
		stroke: var(--wx-gantt-link-color);
		stroke-width: 2;
		z-index: 0;
		fill: transparent;
	}
</style>
