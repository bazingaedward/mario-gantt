<template>
	<div class="container">
		<label class="label">{{ label }}</label>
		<div class="wrapper">
			<select class="select" :value="value" @change="select">
				<option v-for="option in options" :key="option" :value="option">
					{{ option }}
				</option>
			</select>
			<div class="icon" />
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			label: { type: String, default: "" },
			value: { type: String, default: "" },
			options: { type: Array, default: () => [] },
		},
		emits: ["change"],

		methods: {
			select(e) {
				this.$emit("change", e.target.value);
			},
		},
	};
</script>

<style scoped>
	.container {
		margin-bottom: 20px;
	}

	.label {
		display: block;
		margin-bottom: 10px;
		font: var(--wx-label-font);
		color: var(--wx-label-font-color);
	}

	.wrapper {
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
		text-transform: capitalize;
		outline: none;
		appearance: none;
	}

	.select:focus {
		border: 1px solid var(--wx-input-focus-color);
	}

	.icon {
		position: absolute;
		top: 50%;
		right: 11px;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		background: var(--wx-show-more-icon) center center no-repeat;
		pointer-events: none;
	}
</style>
