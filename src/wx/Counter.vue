<template>
	<div class="counter">
		<label class="label">{{ label }}</label>
		<div class="controls">
			<button class="btn btn-dec" @click="dec">
				<svg
					class="dec"
					width="12"
					height="2"
					viewBox="0 0 12 2"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M11.2501 1.74994H0.750092V0.249939H11.2501V1.74994Z" />
				</svg>
			</button>
			<input
				:class="['input', { error }]"
				type="text"
				:value="value"
				@input="input"
			/>
			<button class="btn btn-inc" @click="inc">
				<svg
					class="inc"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M11.2501
					6.74994H6.75009V11.2499H5.25009V6.74994H0.750092V5.24994H5.25009V0.749939H6.75009V5.24994H11.2501V6.74994Z"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			label: { type: String, default: "" },
			value: { type: Number, default: 0 },
			min: { type: Number, default: 1 },
			max: { type: Number, default: Infinity },
			step: { type: Number, default: 1 },
		},
		emits: ["change"],

		data: () => ({
			digits: new RegExp("^[0-9]+$"),
			error: false,
		}),

		methods: {
			inc() {
				if (this.value >= this.max) return;
				const v = this.value + this.step;
				this.$emit("change", v);
			},

			dec() {
				if (this.value <= this.min) return;
				const v = this.value - this.step;
				this.$emit("change", v);
			},

			input(e) {
				const v = e.target.value;
				if (this.digits.test(v)) {
					this.error = false;
					this.$emit("change", v);
				} else {
					this.error = true;
				}
			},
		},
	};
</script>

<style scoped>
	.counter {
		margin-bottom: 20px;
	}

	.label {
		display: block;
		margin-bottom: 10px;
		font: var(--wx-label-font);
		color: var(--wx-label-font-color);
	}

	.controls {
		display: flex;
	}

	.input {
		box-sizing: border-box;
		width: 40px;
		height: 32px;
		border: var(--wx-input-border);
		border-radius: var(--wx-input-border-radius);
		font: var(--wx-input-font);
		color: var(--wx-input-font-color);
		text-align: center;
		outline: none;
	}

	.input:focus {
		border: 1px solid var(--wx-input-focus-color);
	}

	.input.error {
		border: 1px solid var(--wx-danger-color);
	}

	.btn {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 32px;
		border: var(--wx-input-border);
		border-radius: var(--wx-input-border-radius);
		font: var(--wx-input-font);
		color: var(--wx-input-font-color);
		background-color: inherit;
		outline: none;
		cursor: pointer;
	}

	.btn:active {
		border: var(--wx-input-border);
		border-color: var(--wx-input-focus-color);
	}

	.btn-dec {
		border-right: 1px solid transparent;
		border-radius: 2px 0 0 2px;
	}
	.btn-inc {
		border-left: 1px solid transparent;
		border-radius: 0 2px 2px 0;
	}

	.dec,
	.inc {
		fill: var(--wx-input-focus-color);
	}
</style>
