<template>
	<button :class="['btn', appearance]" @click="$emit('click')">
		<slot />
	</button>
</template>

<script>
	export default {
		props: {
			appearance: { type: String, default: "primary" },
		},
		emits: ["click"],
	};
</script>

<style scoped>
	.btn {
		min-width: 82px;
		padding: 8px 16px;
		border: none;
		border-radius: var(--wx-button-radius);
		font: var(--wx-button-font);
		text-transform: uppercase;
		cursor: pointer;
	}

	.btn:active {
		outline: none;
		opacity: 0.7;
	}

	.btn:focus {
		outline: none;
	}

	.primary {
		margin-right: 20px;
		color: var(--wx-button-primary-font-color);
		background-color: var(--wx-button-primary-color);
	}

	.primary:hover {
		background-color: var(--wx-button-primary-color-hover);
	}

	.danger {
		color: var(--wx-button-danger-font-color);
		background-color: var(--wx-button-danger-color);
	}

	.danger:hover {
		background-color: var(--wx-button-danger-color-hover);
	}
</style>
