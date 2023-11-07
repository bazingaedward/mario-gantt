<template>
	<div class="datepicker">
		<label class="label">{{ label }}</label>
		<div class="input-wrapper">
			<input
				type="text"
				class="input"
				:value="formatDate"
				:placeholder="placeholder"
				:readonly="readonly"
				@focus="focus"
				@blur="blur"
			/>
			<div class="wrapper" v-if="show" ref="node">
				<Calendar :date="value" :value="value" @change="selectDate" />
			</div>
			<div class="icon" />
		</div>
	</div>
</template>

<script>
	import Calendar from "./Calendar";

	function zeros(value) {
		const str = value.toString();
		return str.length === 1 ? "0" + str : str;
	}

	export default {
		components: {
			Calendar,
		},

		props: {
			id: { default: "" },
			label: { default: "" },
			placeholder: { default: "" },
			format: {
				type: Function,
				default: v =>
					v.getFullYear() +
					"." +
					zeros(v.getMonth() + 1) +
					"." +
					zeros(v.getDate()),
			},
			parse: { type: Function, default: v => new Date(v) },
			value: { default: new Date() },
			readonly: { default: false },
		},
		emits: ["change"],

		data: () => ({
			show: false,
		}),

		methods: {
			selectDate(v) {
				this.show = false;
				this.$emit("change", v);
			},

			focus() {
				this.show = true;
			},

			blur(e) {
				if (!this.readonly) {
					const v = e.target.value;
					const d = this.parse(v);
					if (this.isDate(d)) {
						this.$emit("change", d);
					}
				}
			},

			isDate(date) {
				return date instanceof Date && !isNaN(date.valueOf());
			},

			down(e) {
				if (this.$refs.node && !this.$refs.node.contains(e.target)) {
					this.show = false;
				}
			},
		},

		mounted() {
			document.body.addEventListener("mousedown", this.down);
		},

		beforeUnmount() {
			document.body.removeEventListener("mousedown", this.down);
		},

		computed: {
			formatDate() {
				return this.value ? this.format(this.value) : "";
			},
		},
	};
</script>

<style scoped>
	.datepicker {
		position: relative;
		margin-bottom: 20px;
	}

	.label {
		display: block;
		margin-bottom: 10px;
		font: var(--wx-label-font);
		color: var(--wx-label-font-color);
	}

	.input-wrapper {
		position: relative;
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

	.icon {
		position: absolute;
		top: 50%;
		right: 11px;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		background: var(--wx-calendar-icon) center center no-repeat;
		pointer-events: none;
	}

	.wrapper {
		position: absolute;
		z-index: 1;
		background: white;
	}
</style>
