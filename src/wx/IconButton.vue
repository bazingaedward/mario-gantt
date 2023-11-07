<template>
	<button :class="['button', appearance]" @click="$emit('click')">
		<span v-if="icon" :class="['icon', icon]"></span>
	</button>
</template>

<script>
	export default {
		props: {
			appearance: { type: String, default: "primary" },
			icon: { type: String, default: "" },
		},
	};
</script>

<style scoped>
	.button {
		width: 50px;
		height: 50px;
		border: none;
		outline: none;
		border-radius: 50%;
		cursor: pointer;
	}

	.primary {
		color: var(--wx-button-primary-font-color);
		background-color: var(--wx-button-primary-color);
	}

	.primary:hover {
		color: var(--wx-button-primary-font-color);
		background-color: var(--wx-button-primary-color-hover);
	}

	.icon {
		font-size: 20px;
	}
</style>
