<script lang="ts">
	import type { ComboboxInterface } from '@/';
	import { Add } from '@//assets/icons';
	import { Button } from '@//components/button';
	import { Combobox, type FormItemsArray } from '@//components/combobox';
	import { FormError } from '@//components/error';
	import { Label } from '@//components/label';
	import { toast } from 'svelte-sonner'; 

	export let onSelected: (item: ComboboxInterface) => void;
	export let formItems: FormItemsArray;
	export let data:
		| {
				id: string;
				name: string | null;
				photo?: string | null;
				logo?: string | null;
		  }[]
		| undefined;
	export let errors: any = {};
	export let label = '';
	export let singularLabel = '';

	function addItem() {
		if (formItems.length === 0) {
			formItems = [{ id: '' }];
			return;
		}
		if (formItems[formItems.length - 1].id === '') {
			toast.error(`Please fill the previous ${singularLabel}`);
			return;
		}
		formItems = [...formItems, { id: '' }];
	}

	function handleClose(lastItem: ComboboxInterface) {
		if (lastItem.value == undefined || lastItem.value == '') {
			formItems = formItems.slice(0, -1) as FormItemsArray;
		}
	}
</script>

<Label for={label}>
	{#if formItems.length > 1}
		{label}
	{:else}
		{singularLabel}
	{/if}
</Label>

<div class="p-2 mx-8 my-4 mb-2 space-y-2 border rounded-lg">
	{#each formItems as item, i}
		<div class="flex flex-col items-center w-full gap-2">
			<Combobox
				items={data?.map((e) => ({
					label: e.name || 'Undefined',
					value: e.id,
					photo: e.photo || e.logo || 'https://via.placeholder.com/64'
				})) || []}
				selectedItems={formItems.map((e) => e.id)}
				value={{
					value: item.id,
					label:
						data?.find((e) => e.id === item.id)?.name ||
						`Select a ${singularLabel.toLowerCase()}...`,
					photo:
						data?.find((e) => e.id === item.id)?.photo || data?.find((e) => e.id === item.id)?.logo
				}}
				onSelected={(selectedItem) => {
					if (selectedItem.value) {
						onSelected(selectedItem);
						formItems[i].id = selectedItem.value;
					} else {
						toast.error(`Please select a ${singularLabel.toLowerCase()}`);
					}
				}}
				onClose={handleClose}
			/>
		</div>
		{#if i === formItems.length - 1}
			<div class="flex items-center justify-center w-full h-full">
				<Button variant="ghost" size="sm" aria-label="add" on:click={() => addItem()}>
					<Add class="w-8 h-8" />
				</Button>
			</div>
		{/if}
	{/each}
	{#if formItems.length === 0}
		<div class="border rounded-lg">
			<div class="flex items-center justify-center w-full h-full">
				<Button variant="ghost" size="sm" aria-label="add" on:click={() => addItem()}>
					<Add class="w-8 h-8" />
				</Button>
			</div>
		</div>
	{/if}
	{#if errors?._errors}
		<FormError errors={errors._errors} />
	{/if}
</div>
