<template>
	<div class="area">
		<label class="label">{{ label }}</label>
		<textarea
			class="textarea"
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
		},
		emits: ["change"],

		methods: {
			input(e) {
				this.$emit("change", e.target.value);
			},
		},
	};
</script>

<style scoped>
	.area {
		margin-bottom: 20px;
		font: var(--wx-font);
	}

	.label {
		display: block;
		margin-bottom: 10px;
		font: var(--wx-label-font);
		color: var(--wx-label-font-color);
	}

	.textarea {
		box-sizing: border-box;
		width: 100%;
		height: 70px;
		padding: var(--wx-input-padding);
		border: var(--wx-input-border);
		border-radius: var(--wx-input-border-radius);
		font: var(--wx-input-font);
		color: var(--wx-input-font-color);
		resize: vertical;
		outline: none;
	}

	.textarea:focus {
		border: 1px solid var(--wx-input-focus-color);
	}
</style>
