<template>
	<div class="area" ref="area" @mousemove="move">
		<div
			v-if="(id && content) || tooltip"
			class="tooltip"
			ref="tooltipNode"
			:style="{ top: pos.top + 'px', left: pos.left + 'px' }"
		>
			<template v-if="id">
				<component :is="content" :data="tooltipData"></component>
			</template>

			<template v-else>{{ tooltip }}</template>
		</div>

		<slot />
	</div>
</template>

<script>
	export default {
		props: {
			content: { default: null },
			data: { default: null },
		},

		data: () => ({
			id: null,
			tooltip: null,
			tooltipData: null,
			tooltipNode: null,
			target: null,
			targetCoords: null,
			areaCoords: null,
			pos: null,
		}),

		methods: {
			locate(node) {
				while (node) {
					if (node.getAttribute) {
						const id = node.getAttribute("data-tooltip-id");
						const tooltip = node.getAttribute("data-tooltip");
						if (id || tooltip) return { id, tooltip, target: node };
					}
					node = node.parentNode;
				}

				return { id: null, tooltip: null, target: null };
			},

			move(e) {
				const data = this.locate(e.target);

				this.id = data.id;
				this.tooltip = data.tooltip;
				this.target = data.target;

				if (!this.id && !this.tooltip) return;

				if (this.id && this.data) {
					this.tooltipData = this.data(this.id);
				}

				this.targetCoords = this.target.getBoundingClientRect();
				this.areaCoords = this.$refs.area.getBoundingClientRect();

				const top =
					this.targetCoords.top +
					this.targetCoords.height -
					this.areaCoords.top +
					5;
				const left = this.targetCoords.left - this.areaCoords.left;

				this.pos = { top, left };
			},
		},

		updated() {
			if (this.$refs.tooltipNode) {
				const node = this.$refs.tooltipNode;
				const tooltipCoords = node.getBoundingClientRect();
				if (tooltipCoords.right >= this.areaCoords.right) {
					this.pos.left = this.areaCoords.width - tooltipCoords.width - 5;
				}
				if (tooltipCoords.bottom >= this.areaCoords.bottom) {
					this.pos.top = this.targetCoords.top - tooltipCoords.height - 5;
				}
			}
		},
	};
</script>

<style scoped>
	.area {
		position: relative;
		height: 100%;
		width: 100%;
	}
</style>

<style>
	.tooltip {
		position: absolute;
		z-index: 10;
		font: var(--wx-small-font);
		color: var(--wx-font-color);
		background-color: #fff;
	}
</style>
