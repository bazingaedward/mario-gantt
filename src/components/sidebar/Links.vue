<template>
	<template v-for="(links, index) in linksData" :key="index">
		<div v-if="links.data.length" class="links">
			<p class="label">{{ links.title }}</p>

			<table class="table" @click="click">
				<tr v-for="obj in links.data" :key="obj" class="row">
					<td class="cell">
						<div class="task-name">
							{{ obj.task.text || obj.task.textRight || obj.task.textLeft }}
						</div>
					</td>

					<td class="cell">
						<div class="wrapper">
							<select
								class="select"
								:value="obj.link.type"
								:data-id="obj.link.id"
								@change="select"
							>
								<option v-for="item in list" :key="item.id" :value="item.id">
									{{ item.text }}
								</option>
							</select>
							<div class="icon-more" />
						</div>
					</td>

					<td>
						<div
							class="icon-delete"
							data-action="delete-link"
							:data-id="obj.link.id"
						/>
					</td>
				</tr>
			</table>
		</div>
	</template>
</template>

<script>
	export default {
		props: ["linksData"],

		emits: ["action"],

		data: () => ({
			list: [
				{ id: 0, text: "End-to-start" },
				{ id: 1, text: "Start-to-start" },
				{ id: 2, text: "End-to-end" },
				{ id: 3, text: "Start-to-end" },
			],
		}),

		methods: {
			click(e) {
				const { action, id } = e.target.dataset;
				if (action) {
					this.$emit("action", { action, id });
				}
			},

			select(e) {
				const id = e.target.dataset.id;
				const value = e.target.value * 1;
				this.$emit("action", {
					action: "update-link",
					id,
					obj: { type: value },
				});
			},
		},
	};
</script>

<style scoped>
	.links {
		margin-bottom: 10px;
	}

	.label {
		margin-bottom: 10px;
		font: var(--wx-label-font);
		color: var(--wx-label-font-color);
	}

	.cell {
		text-align: center;
	}

	.task-name {
		font: var(--wx-input-font);
		color: var(--wx-input-font-color);
		width: 90px;
		text-align: left;
		overflow: hidden;
		white-space: nowrap;
	}

	.wrapper {
		width: 225px;
		position: relative;
		display: flex;
	}

	.select {
		width: 100%;
		padding: var(--wx-input-padding);
		border: var(--wx-input-border);
		border-radius: var(--wx-input-border-radius);
		font: var(--wx-input-font);
		color: var(--wx-input-font-color);
		outline: none;
		appearance: none;
	}

	.select:focus {
		border: 1px solid var(--wx-input-focus-color);
	}

	.icon-more {
		position: absolute;
		top: 50%;
		right: 11px;
		width: 20px;
		height: 20px;
		transform: translateY(-50%);
		background: var(--wx-show-more-icon) center center no-repeat;
		pointer-events: none;
	}

	.icon-delete {
		width: 20px;
		height: 20px;
		margin-left: 12px;
		background: var(--wx-remove-link-icon) center center no-repeat;
		opacity: 0.2;
		cursor: pointer;
	}

	.icon-delete:hover {
		opacity: 1;
	}
</style>
