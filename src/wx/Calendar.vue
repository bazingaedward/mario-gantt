<template>
	<div class="calendar">
		<div class="controls">
			<div class="icon mdi mdi-chevron-left" @click="changeMonth(-1)" />
			<div class="month">{{ currentDate }}</div>
			<div class="icon mdi mdi-chevron-right" @click="changeMonth(1)" />
		</div>

		<div class="days">
			<div class="day" v-for="day in dayNames" :key="day">{{ day }}</div>
		</div>

		<div class="dates" @click="selectDate">
			<div
				class="date"
				v-for="(date, index) in dates()"
				:key="date"
				:class="date.c"
				:data-index="index"
			>
				<span>{{ date.v }}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { inject } from "vue";
	import locale from "./locales/en";
	import { LocaleContext } from "./locale";

	export default {
		props: ["value", "date", "startOnMonday"],
		emits: ["change"],
		setup() {
			const locDates = (inject(LocaleContext, null) || locale())._("__dates");
			return { locDates };
		},
		data() {
			const days = this.locDates.days;
			const shift = this.startOnMonday ? 1 : 0;
			return {
				v: this.value || null,
				d: this.date || new Date(),
				shiftDays: shift,
				dayNames: shift ? days : days.slice(1).concat(days[6]),
				month: null,
				year: null,
			};
		},

		methods: {
			changeMonth(dir) {
				const temp = new Date(this.d);
				temp.setMonth(temp.getMonth() + dir);
				this.d = temp;
			},

			hashDate(d) {
				if (!d) return 0;
				return d.getFullYear() * 12 * 40 + d.getMonth() * 40 + d.getDate();
			},

			selectDate(e) {
				let ind = e.target.dataset.index;
				if (!ind) ind = e.target.parentNode.dataset.index;
				if (!ind) return;

				const temp = new Date(this.start);
				temp.setDate(temp.getDate() + ind * 1);
				this.v = temp;
				this.$emit("change", temp);
			},

			dates() {
				const date = this.d;
				const value = this.v;

				this.year = date.getFullYear();
				this.month = date.getMonth();

				this.start = new Date(date);
				this.start.setDate(1);
				const sDay = -this.start.getDay() - this.shiftDays + 2;
				this.start.setDate(sDay);

				const valueHash = this.hashDate(value);
				const now = new Date(this.start);

				const dates = [];

				for (let i = 0; i < 6 * 7; i++) {
					const nowDay = now.getDay();
					const nowMonth = now.getMonth();
					const weekDay = nowDay === 0 || nowDay === 6;
					const currentMonth = nowMonth === this.month;
					const selected = valueHash === this.hashDate(now);

					dates.push({
						v: now.getDate(),
						c:
							"date " +
							(selected ? "selected " : "") +
							(weekDay ? "weekend " : "") +
							(!currentMonth ? "outside " : ""),
					});

					now.setDate(now.getDate() + 1);
				}

				return dates;
			},
		},

		computed: {
			currentDate() {
				return this.locDates.months[this.month] + " " + this.year;
			},
		},
	};
</script>

<style scoped>
	.calendar {
		box-sizing: border-box;
		width: 183px;
		padding: 7px;
		border: var(--wx-calendar-border);
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.icon {
		font-size: 20px;
		color: rgba(0, 0, 0, 0.5);
		cursor: pointer;
		user-select: none;
		transition: color 0.15s ease-in;
	}

	.month {
		font: var(--wx-calendar-month-font);
		color: var(--wx-calendar-month-font-color);
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: 28px;
	}

	.day {
		font: var(--wx-calendar-days-font);
		color: var(--wx-calendar-days-font-color);
		align-self: center;
		text-align: center;
	}

	.dates {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 24px);
		font: var(--wx-calendar-dates-font);
		color: var(--wx-calendar-dates-font-color);
	}

	.date {
		cursor: pointer;
		align-self: center;
		text-align: center;
	}

	.weekend {
		color: var(--wx-input-focus-color);
	}

	.outside {
		color: rgba(0, 0, 0, 0.3);
	}

	.selected span {
		display: inline-block;
		color: #fff;
		background-color: var(--wx-input-focus-color);
		width: 20px;
		height: 20px;
		line-height: 20px;
		border-radius: 50%;
	}
</style>
