<template>
	<div
		class="bars"
		ref="layer"
		:style="lineHeight"
		@contextmenu="contextmenu"
		@mousedown="mousedown"
		@mouseup="mouseup"
		@mousemove="mousemove"
		@touchstart="touchstart"
		@touchmove="touchmove"
		@touchend="touchend"
		@click="click"
		@dblclick="dblclick"
		@dragstart="() => false"
	>
		<div
			v-for="task in tasks"
			:key="task.id"
			:class="[
				'bar',
				task.type || 'task',
				{ touch: touched && taskMove && task.id == taskMove.id },
			]"
			:style="taskStyle(task)"
			:data-id="task.id"
			:data-type="task.type"
			:data-tooltip-id="task.id"
		>
			<div class="link left"></div>

			<template v-if="task.type !== 'milestone'">
				<div v-if="task.progress" class="progress-wrapper">
					<div
						class="progress-percent"
						:style="{ width: task.progress + '%' }"
					/>
				</div>

				<div v-if="task.textLeft" class="textLeft">{{ task.textLeft }}</div>
				<div v-if="task.textRight" class="textRight">{{ task.textRight }}</div>

				<component
					v-if="template"
					:is="templates.taskText"
					:data="task"
				></component>

				<div v-else class="text">{{ task.text }}</div>
			</template>

			<template v-else>
				<div class="content"></div>
				<div class="textRight">{{ task.text || task.textRight }}</div>
			</template>

			<div class="link right"></div>
		</div>

		<NewLink
			v-if="start && end && newLink"
			:layer="$refs.layer"
			:start="start"
			:end="end"
		/>
	</div>
</template>

<script>
	import { locate, locateID } from "@dhtmlx/trial-lib-gantt";
	import NewLink from "./NewLink.vue";

	export default {
		components: {
			NewLink,
		},

		props: ["tasks", "drag", "newLink", "cellWidth", "templates"],

		data: () => ({
			taskMove: null,
			layer: null,
			start: null,
			end: null,
			ignoreNextClick: false,
			touched: null,
			touchTimer: null,
		}),

		methods: {
			mousedown(e) {
				const node = locate(e);
				if (!node) return;

				this.down(node, e.target, e);
			},

			mousemove(e) {
				this.move(e, e);
			},

			mouseup(e) {
				this.up(e);
			},

			touchstart(e) {
				const node = locate(e);
				if (node) {
					const target = e.target;
					this.touchTimer = setTimeout(() => {
						this.touched = true;
						this.down(node, target, e.touches[0]);
					}, 300);
				}
			},

			touchmove(e) {
				if (this.touched) {
					e.preventDefault();
					this.move(e, e.touches[0]);
				} else if (this.touchTimer) {
					clearTimeout(this.touchTimer);
					this.touchTimer = null;
				}
			},

			touchend(e) {
				this.touched = null;
				if (this.touchTimer) {
					clearTimeout(this.touchTimer);
					this.touchTimer = null;
				}

				this.up(e.changedTouches[0]);
			},

			contextmenu(e) {
				if (!this.touched || !this.touchTimer) {
					e.preventDefault();
					return false;
				}
			},

			down(node, target, point) {
				const { clientX, clientY } = point;
				const id = node.dataset.id;
				const css = target.classList;

				if (css.contains("link")) {
					this.start = {
						id,
						start: css.contains("left"),
						x: clientX,
						y: clientY,
					};
					this.startDrag();
				} else {
					let mode = this.getMoveMode(node, point) || "move";

					this.taskMove = {
						id,
						mode,
						node,
						x: clientX,
						dx: 0,
						l: parseInt(node.style.left),
						w: parseInt(node.style.width),
					};
					this.startDrag();
				}
			},

			up(point) {
				if (this.start) {
					const { clientX, clientY } = point;

					const source = this.start.id;
					const fromStart = this.start.start;
					this.start = this.end = null;

					const targetNode = document.elementFromPoint(clientX, clientY);
					const node = locate(targetNode);
					if (!node) return;

					const css = node.classList;
					const target = node.dataset.id;
					if (!target || source == target) return;

					let toStart = true;
					if (css.contains("link")) {
						if (css.contains("right")) {
							toStart = false;
						}
					} else {
						const rect = node.getBoundingClientRect();
						const x = clientX - rect.left;
						const w = rect.width;
						toStart = x < w / 2;
					}

					const type = (fromStart ? 1 : 0) + (toStart ? 0 : 2);
					if (this.newLink) {
						this.$emit("action", {
							action: "add-link",
							obj: { source, target, type },
						});
					}
					this.endDrag();
				} else if (this.taskMove) {
					const { id, mode, dx, node, l, w, start } = this.taskMove;
					this.taskMove = null;

					if (!start) return;

					const time = Math.round(dx / this.cellWidth);
					// restore node position
					if (!time) {
						node.style.left = `${l}px`;
						node.style.width = `${w}px`;
					}
					this.$emit("action", {
						action: "update-task-time",
						id,
						obj: { mode, time },
					});
					this.ignoreNextClick = true;
					this.endDrag();
				}
			},

			move(e, point) {
				const { clientX, clientY } = point;

				if (this.start) {
					this.end = { x: clientX, y: clientY };
				} else if (this.taskMove && this.drag) {
					const { node, mode, l, w, x, id } = this.taskMove;
					const dx = (this.taskMove.dx = clientX - x);
					if (!this.start && Math.abs(dx) < 20) return;

					if (mode === "start") {
						node.style.left = `${l + dx}px`;
						node.style.width = `${w - dx}px`;
					} else if (mode === "end") {
						node.style.width = `${w + dx}px`;
					} else if (mode === "move") {
						node.style.left = `${l + dx}px`;
					}

					this.taskMove.start = true;

					this.$emit("action", {
						action: "move-task",
						id,
						obj: {
							width: parseInt(node.style.width),
							left: parseInt(node.style.left),
						},
					});
				} else {
					const mnode = locate(e);
					if (mnode) {
						const mode = this.getMoveMode(mnode, point);
						mnode.style.cursor = mode ? "col-resize" : "pointer";
					}
				}
			},

			click(e) {
				if (this.ignoreNextClick) {
					this.ignoreNextClick = true;
					return;
				}

				const id = locateID(e.target);

				if (id) {
					this.$emit("action", { action: "select-task", id });
				}
			},

			dblclick(e) {
				const id = locateID(e.target);

				if (id) {
					this.$emit("action", { action: "show-details", id });
				}
			},

			getMoveMode(node, e) {
				if (this.getTask(node.dataset.id).type === "milestone") return "";

				const rect = node.getBoundingClientRect();
				const p = (e.clientX - rect.left) / rect.width;
				let delta = 0.2 / (rect.width > 200 ? rect.width / 200 : 1);

				if (p < delta) return "start";
				if (p > 1 - delta) return "end";
				return "";
			},

			getTask(id) {
				return this.tasks.find(a => a.id == id);
			},

			taskStyle(task) {
				return `left:${task.$x}px;top:${task.$y}px;width:${task.$w}px;height:${task.$h}px`;
			},

			startDrag() {
				document.body.style.userSelect = "none";
			},

			endDrag() {
				document.body.style.userSelect = "";
			},
		},

		computed: {
			addLink() {
				const data = !!this.$refs.layer && !!this.start && !!this.end;
				return data;
			},

			lineHeight() {
				return `line-height: ${this.tasks.length ? this.tasks[0].$h : 0}px`;
			},

			template() {
				return this.templates && this.templates.taskText;
			},
		},
	};
</script>

<style scoped>
	.bars {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.bar {
		box-sizing: border-box;
		position: absolute;
		border-radius: var(--wx-gantt-bar-border-radius);
		font: var(--wx-gantt-bar-font);
		white-space: nowrap;
		line-height: inherit;
		text-align: center;
		cursor: pointer;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}

	.bar.touch {
		opacity: 0.5;
	}

	.task {
		border: 1px solid var(--wx-gantt-task-border-color);
		border-color: var(--wx-gantt-task-border-color);
		color: var(--wx-gantt-task-font-color);
		background-color: var(--wx-gantt-task-color);
	}

	.project {
		border: 1px solid var(--wx-gantt-project-border-color);
		border-color: var(--wx-gantt-project-border-color);
		color: var(--wx-gantt-project-font-color);
		background-color: var(--wx-gantt-project-color);
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		user-select: none;
	}

	.text {
		position: relative;
		z-index: 2;
		display: inline;
	}

	.textRight,
	.textLeft {
		position: absolute;
		line-height: normal;
		display: block;
		left: 100%;
		color: var(--wx-font-color);
		pointer-events: none;
		padding: 0 10px;
	}
	.textLeft {
		left: auto;
		right: 100%;
	}

	.milestone .textRight {
		padding: 0;
	}

	.milestone .content {
		height: 100%;
		background-color: var(--wx-gantt-milestone-color);
		transform: rotate(45deg) scale(0.75);
	}

	.progress-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: transparent;
		border-radius: var(--wx-gantt-bar-border-radius);
		overflow: hidden;
	}

	.progress-percent {
		height: 100%;
	}

	.task .progress-percent {
		background-color: var(--wx-gantt-task-fill-color);
	}

	.project .progress-percent {
		background-color: var(--wx-gantt-project-fill-color);
	}

	.link {
		position: absolute;
		z-index: 2;
		top: 50%;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1px solid #929292;
		background-color: #f0f0f0;
		cursor: pointer;
		user-select: none;
		opacity: 0;
	}

	.link.left {
		left: -8px;
	}

	.link.right {
		right: -8px;
	}

	.bar:hover .link,
	.link:hover {
		opacity: 1;
	}

	.milestone .link.left {
		left: -16px;
	}
	.milestone .link.right {
		right: -16px;
	}
</style>
