<template>
	<div class="grid" :style="{ flex: `0 0 ${basis}` }">
		<Header
			:compactMode="compactMode"
			:columns="cols"
			:height="scales.height"
			@action="action"
		/>

		<Body
			:tasks="tasks"
			:columns="cols"
			:cellHeight="cellHeight"
			:scrollTop="scrollTop"
			:scrollDelta="scrollDelta"
			:selected="selected"
			@action="action"
		/>
	</div>
</template>

<script>
	import Header from "./Header.vue";
	import Body from "./Body.vue";

	export default {
		components: {
			Header,
			Body,
		},

		data: () => ({
			showFull: false,
		}),

		props: [
			"compactMode",
			"width",
			"tasks",
			"columns",
			"scales",
			"cellHeight",
			"scrollTop",
			"scrollDelta",
			"selected",
		],

		methods: {
			action(ev) {
				const { action } = ev;

				switch (action) {
					case "toggle-grid":
						this.showFull = !this.showFull;
						break;

					default:
						this.$emit("action", ev);
						break;
				}
			},
		},

		computed: {
			cols() {
				const { compactMode, columns } = this;
				return compactMode
					? [
							columns[columns.length - 1],
							...columns.slice(0, columns.length - 1),
					  ]
					: columns;
			},

			basis() {
				return this.showFull ? "100%" : `${this.width}px`;
			},
		},

		watch: {
			compactMode() {
				if (!this.compactMode) {
					this.showFull = false;
				}
			},
		},
	};
</script>

<style scoped>
	.grid {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border-right: 1px solid var(--wx-border-color);
		overflow: hidden;
	}
</style>
