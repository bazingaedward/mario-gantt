<template>
	<div class="slider">
		<label class="label">{{ label }}</label>
		<input
			type="range"
			class="range"
			:style="bgStyle"
			:value="value"
			:min="min"
			:max="max"
			:step="step"
			@input="input"
		/>
	</div>
</template>

<script>
	export default {
		props: {
			label: { type: String, default: "" },
			value: { type: Number, default: 0 },
			min: { type: Number, default: 0 },
			max: { type: Number, default: 100 },
			step: { type: Number, default: 1 },
			inactive: { type: String, default: "#dbdbdb" },
		},
		emits: ["change"],

		methods: {
			input(e) {
				this.$emit("change", +e.target.value);
			},
		},

		computed: {
			bgStyle() {
				const { value, min, max, inactive } = this;
				const progress = ((value - min) / (max - min)) * 100 + "%";
				return `background: linear-gradient(90deg, var(--wx-input-focus-color) 0% ${progress}, ${inactive} ${progress} 100%);`;
			},
		},
	};
</script>

<style scoped>
	.slider {
		margin-bottom: 20px;
	}

	.label {
		display: block;
		margin-bottom: 10px;
		font: var(--wx-label-font);
		color: var(--wx-label-font-color);
	}

	.range {
		width: 100%;
		background-color: #dbdbdb;
		-webkit-appearance: none;
		border-radius: 4px;
	}

	.range:focus {
		outline: none;
	}

	.range::-webkit-slider-runnable-track {
		border-radius: 4px;
		width: 100%;
		height: 8px;
		cursor: pointer;
	}

	.range::-webkit-slider-thumb {
		margin-top: -6px;
		width: 20px;
		height: 20px;
		background: var(--wx-input-focus-color);
		border: 2px solid #ffffff;
		border-radius: 50%;
		cursor: pointer;
		-webkit-appearance: none;
	}

	.range::-moz-range-track {
		background-color: transparent;
		border-top: 5px solid #fff;
		border-bottom: 5px solid #fff;
		width: 100%;
		height: 8px;
		cursor: pointer;
	}

	.range::-moz-range-thumb {
		width: 14px;
		height: 14px;
		background: var(--wx-input-focus-color);
		border: 2px solid #ffffff;
		border-radius: 50%;
		cursor: pointer;
	}

	.range::-moz-range-progress {
		background-color: var(--wx-input-focus-color);
		height: 8px;
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.range::-ms-track {
		background: transparent;
		border-color: transparent;
		border-width: 5px 0;
		color: transparent;
		width: 100%;
		height: 8px;
		cursor: pointer;
	}

	.range::-ms-fill-lower {
		background: var(--wx-input-focus-color);
		border: 0.2px solid var(--wx-input-focus-color);
		border-radius: 8px;
	}

	.range::-ms-fill-upper {
		background: #dbdbdb;
		border: 0.2px solid #dbdbdb;
		border-radius: 8px;
	}

	.range::-ms-thumb {
		width: 16px;
		height: 16px;
		background: var(--wx-focus-color);
		border: 2px solid #ffffff;
		border-radius: 50%;
		cursor: pointer;
		margin-top: 0px;
	}

	.range:focus::-ms-fill-lower {
		background: var(--wx-focus-color);
	}

	.range:focus::-ms-fill-upper {
		background: #dbdbdb;
	}
</style>
