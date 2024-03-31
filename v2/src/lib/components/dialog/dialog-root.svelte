<script lang="ts">
	import { Close } from '@//assets/icons';
	import { generateId } from '@//utils';
	import { onMount } from 'svelte';
	import { Button } from '../button';

	export let title = 'Dialog';

	const id = generateId();
	let dialog: HTMLDialogElement | null = null;

	onMount(() => {
		dialog = document.getElementById(id) as HTMLDialogElement;
	});
</script>

<Button
	class="px-3 py-2"
	slot="trigger"
	on:click={() => {
		dialog?.showModal();
	}}
>
	<slot name="trigger" />
</Button>
<dialog {id}>
	<div class="flex items-center justify-between p-4">
		<h2 class="text-lg font-semibold">{title}</h2>
		<Button
			class="px-3 py-2"
			on:click={() => {
				dialog?.close();
			}}
		>
			<Close />
		</Button>
	</div>
  <slot name="content" />
  <slot name="footer" />
  
</dialog>

<style>
	:root {
		padding: 10px;
	}
	dialog {
		border-radius: 5px;
		border-width: 1px;
		transition: all 2s;
	}
	dialog::backdrop {
		background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
		animation: fade-in 1s;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
