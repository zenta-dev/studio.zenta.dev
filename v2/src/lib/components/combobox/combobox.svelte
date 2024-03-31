<script lang="ts">
	import type { ComboboxInterface } from '@/';
	import Close from '@//assets/icons/close.svelte';
	import { Button } from '@//components/button';
	import { Input } from '@//components/input';
	import { cn, generateId } from '@//utils';
	import { Image } from '@unpic/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Svroller } from 'svrollbar';

	export let onSelected: (item: ComboboxInterface) => void;
	export let onClose: (lastIem: ComboboxInterface) => void;
	export let items: ComboboxInterface[];
	export let value: ComboboxInterface = { label: 'Select an item' };
	export let selectedItems: string[] = [];

	let filteredItems: ComboboxInterface[] = [];
	let menuOpen = false;

	const comboboxId = generateId();

	const handleInput = (e: InputEvent) => {
		const value = (e.target as HTMLInputElement).value;
		filteredItems = items.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));
	};

	onMount(() => {
		window.addEventListener('click', (e) => {
			if (!document?.getElementById(comboboxId)?.contains(e.target as Node)) {
				menuOpen = false;
			}
		});
	});

	function handleSelect(item: ComboboxInterface) {
		if (selectedItems.length > 0) {
			if (selectedItems.includes(item.value || '')) {
				toast.error('Item already selected');
				return;
			}
		}

		onSelected(item);
		value = item;
		menuOpen = false;
	}

	function handleClose() {
		onClose(value);
		menuOpen = false;
	}
</script>

<section class="relative inline-block w-full" id={comboboxId}>
	<Button
		role="combobox"
		on:click={() => (menuOpen = !menuOpen)}
		class="w-full h-full"
		variant="outline"
	>
		{#if value.value}
			<div class="flex items-center justify-center gap-2">
				<Image
					src={value.photo || 'https://via.placeholder.com/24'}
					alt={value.label}
					width={24}
					height={24}
					class="w-6 h-6 rounded-full"
				/>
				<p>
					{value.label}
				</p>
			</div>
		{:else}
			<p>
				{value.label}
			</p>
		{/if}
	</Button>

	<div
		class={cn(
			'absolute border rounded-lg min-w-64 w-full z-50  bg-neutral-900 text-foreground p-2',
			menuOpen && 'block',
			!menuOpen && 'hidden'
		)}
		role="listbox"
	>
		<div class="flex w-full e">
			<Input on:input={handleInput} placeholder={`Search an item or scroll it`} class="mb-2" />
			<Button
				variant="ghost"
				class="p-0 px-2"
				on:click={() => {
					handleClose();
				}}
			>
				<Close class="w-6 h-6" />
			</Button>
		</div>

		<Svroller width="100%">
			{#if filteredItems.length > 0}
				{#each filteredItems as item}
					<Button
						class="w-full flex items-center gap-2 my-0.5"
						variant="ghost"
						on:click={() => handleSelect(item)}
					>
						<Image
							src={item.photo || 'https://via.placeholder.com/24'}
							alt={item.label}
							width={24}
							height={24}
							class="w-6 h-6 rounded-full"
						/>
						<p>
							{item.label}
						</p>
					</Button>
				{/each}
			{:else}
				{#each items as item}
					<Button
						class="w-full flex items-center gap-2 my-0.5"
						variant="ghost"
						on:click={() => handleSelect(item)}
					>
						<Image
							src={item.photo || 'https://via.placeholder.com/24'}
							alt={item.label}
							width={24}
							height={24}
							class="w-6 h-6 rounded-full"
						/>
						<p>
							{item.label}
						</p>
					</Button>
				{/each}
			{/if}
		</Svroller>
	</div>
</section>
