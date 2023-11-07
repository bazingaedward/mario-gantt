<template>
	<div class="text">
		<label class="label">{{ label }}</label>
		<input
			ref="node"
			type="text"
			class="input"
			:value="value"
			:placeholder="placeholder"
			:readonly="readonly"
			:disabled="disabled"
			@input="input"
		/>
	</div>
</template>

<script>
	export default {
		props: {
			label: { type: String, default: "" },
			value: { type: String, default: "" },
			placeholder: { type: String, default: "" },
			readonly: { type: Boolean, default: false },
			disabled: { type: Boolean, default: false },
			autofocus: { type: Boolean, default: false },
		},
		emits: ["change"],

		data: () => ({
			node: null,
		}),

		methods: {
			input(e) {
				this.$emit("change", e.target.value);
			},
		},

		mounted() {
			if (this.autofocus) {
				this.$refs.node.focus();
			}
		},
	};
</script>

<style scoped>
	.text {
		margin-bottom: 20px;
	}

	.label {
		display: block;
		margin-bottom: 10px;
		font: var(--wx-label-font);
		color: var(--wx-label-font-color);
	}

	.input {
		box-sizing: border-box;
		width: 100%;
		padding: var(--wx-input-padding);
		border: var(--wx-input-border);
		border-radius: var(--wx-input-border-radius);
		font: var(--wx-input-font);
		color: var(--wx-input-font-color);
		outline: none;
	}

	.input:focus {
		border: 1px solid var(--wx-input-focus-color);
	}
</style>
