<template>
	<div
		class="table"
		ref="node"
		:style="{ top: -(scrollTop - scrollDelta) + 'px' }"
		@wheel.passive="wheel"
		@click="click"
		@dblclick="dblclick"
		@touchstart="touchStart"
		@touchmove="touchMove"
		@touchend="endScroll"
	>
		<div
			v-for="task in tasks"
			:key="task.id"
			:class="['row', { selected: selected && selected.id == task.id }]"
			:style="{ height: cellHeight + 'px' }"
			:data-id="task.id"
		>
			<div
				v-for="column in columns"
				:key="column.name"
				class="cell"
				:style="cellStyle(column)"
			>
				<template v-if="column.name === 'text'">
					<div class="content" :style="contentStyle(task)">
						<div
							class="icon"
							:class="getIcon(task)"
							data-action="toggle-task"
						></div>
						{{ column.template(task) }}
					</div>
				</template>

				<template v-else-if="column.action">
					<span class="add" :data-action="column.action" />
				</template>

				<template v-else>
					{{ column.template(task) }}
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	import { locateID } from "@dhtmlx/trial-lib-gantt";
	import { reorder } from "./actions/reorder";

	export default {
		props: [
			"tasks",
			"columns",
			"cellHeight",
			"scrollTop",
			"scrollDelta",
			"selected",
		],

		data: () => ({
			delta: 20,
			touchY: null,
			scroll: true,
		}),

		mounted() {
			reorder(this.$refs.node, {
				start: e => this.startReorder(e),
				move: e => this.moveReorder(e),
				end: e => this.endReorder(e),
				touchStart: () => this.endScroll(),
			});
		},

		methods: {
			click(e) {
				const id = locateID(e);
				if (!id) return;

				const action = e.target.dataset.action;
				if (action) {
					this.$emit("action", { id, action });
					e.preventDefault();
				} else {
					this.$emit("action", { action: "select-task", id });
				}
			},

			dblclick(e) {
				const id = locateID(e);
				if (id) this.$emit("action", { action: "show-details", id });
			},

			wheel(e) {
				const step = e.deltaMode ? e.deltaY * 18 : e.deltaY;
				const top = Math.max(0, this.scrollTop + step);
				this.$emit("action", { action: "scroll-chart", top });
			},

			touchStart(e) {
				this.scroll = true;
				this.touchY = e.touches[0].clientY + this.scrollTop;
			},

			touchMove(e) {
				if (this.scroll) {
					const delta = this.touchY - e.touches[0].clientY;
					this.$emit("action", { action: "scroll-chart", top: delta });
				}
			},

			endScroll() {
				this.scroll = false;
			},

			cellStyle(column) {
				const align = `text-align:${column.align}`;
				const width =
					column.width === "100%" ? `flex:1` : `width:${column.width}`;
				return `${width};${align}`;
			},

			contentStyle(task) {
				return {
					paddingLeft: (task.$level - 1) * this.delta + "px",
				};
			},

			getIcon(task) {
				if (!task.data) return "";
				return task.open ? "icon-close" : "icon-open";
			},

			startReorder({ id }) {
				id *= 1;
				const task = this.tasks.find(a => a.id === id);
				if (!task) return;

				if (task.open) this.$emit("action", { id, action: "toggle-task" });

				this.$emit("action", { action: "hide-details" });
			},

			moveReorder({ id, top }) {
				this.$emit("action", {
					action: "move-task",
					id,
					obj: { top: top + this.scrollDelta },
				});
			},

			endReorder(result) {
				let id = result.id * 1;
				const { before, after } = result;
				const target = (before || after) * 1;

				if (!target) {
					this.$emit("action", { id, action: "repaint-task" });
					return;
				}

				const mode = before ? "before" : "after";

				this.$emit("action", {
					id,
					action: "reorder-task",
					obj: { id, mode, target },
				});
			},
		},
	};
</script>

<style scoped>
	.table {
		position: relative;
		width: 100%;
		font: var(--wx-grid-body-font);
		color: var(--wx-grid-body-font-color);
	}

	.row {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border-bottom: var(--wx-grid-body-row-border);
	}

	.row.selected {
		background: var(--wx-gantt-select-color);
	}

	.cell {
		box-sizing: border-box;
		flex: 0 0 auto;
		padding: 0 5px;
		overflow: hidden;
	}

	.content {
		width: 100%;
		white-space: nowrap;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.icon {
		width: 12px;
		min-width: 12px;
		height: 12px;
		margin: 0 5px;
		pointer-events: none;
	}

	.icon-close,
	.icon-open {
		cursor: pointer;
		pointer-events: auto;
	}

	.icon-close {
		background: var(--wx-close-btn-icon) center center no-repeat;
	}

	.icon-open {
		background: var(--wx-open-btn-icon) center center no-repeat;
	}

	.add {
		display: inline-block;
		width: 12px;
		height: 12px;
		background: var(--wx-add-btn-icon) center center no-repeat;
		opacity: 0.54;
		cursor: pointer;
	}

	.add:hover {
		opacity: 1;
	}

	.wx-reorder-card.row {
		width: 100%;
		background: white;
		border-top: var(--wx-grid-body-row-border);
		opacity: 50%;
	}

	.wx-reorder.row {
		opacity: 50%;
	}
</style>
