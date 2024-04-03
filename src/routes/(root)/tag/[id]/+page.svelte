<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import { Back } from '@//assets/icons';
	import { SEO } from '@//components/SEO';
	import { Button } from '@//components/button';
	import { FormError } from '@//components/error';
	import { Input, Textarea } from '@//components/input';
	import { Label } from '@//components/label';
	import { imgStore } from '@//store';

	import { ImageUpload } from '@//components/image';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { Svroller } from 'svrollbar';
	import type { PageData } from './$types';

	export let data: PageData;
	let img: string;
	let isLoading = false;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		dataType: 'json',
		onSubmit() {
			isLoading = true;
		},
		onResult({ result }) {
			isLoading = false;
			if (result.type === 'success') {
				if ($form.id) {
					Promise.resolve(
						fetch('/api/image/delete', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({ url: img })
						})
					);
					toast.success('Tag updated successfully');
				} else {
					toast.success('Tag created successfully');
				}
				setTimeout(() => {
					goto('/tag');
				}, 1000);
			}
			if (result.type === 'failure') {
				const { data } = result;
				if (data && data.message) {
					toast.error(data?.message, {
						description: data?.description,
						duration: 5000
					});
				}
			}
		}
	});

	function onUpload(result: any, widget: any) {
		if (result.event === 'success') {
			$form.photo = result.info.secure_url;
			imgStore.set(result.info.secure_url);
			toast.success('Image uploaded successfully');
		} else if (result.event === 'error') {
			toast.error('Failed to upload image');
		}
		widget.close();
	}
	onMount(async () => {
		imgStore.set($form.photo);
		imgStore.subscribe((value) => {
			img = value;
		});
	});
</script>

<main class="flex flex-col">
	<nav class="flex items-center gap-4 p-4 bg-foreground/5">
		<a href="/tag" class="text-xl text-center"><Back /></a>
		<p class="text-xl font-semibold text-center">
			{#if data.form.data.name || 'New Tag'}
				{data.form.data.name || 'New Tag'.length > 20
					? data.form.data.name || 'New Tag'.slice(0, 20) + '...'
					: data.form.data.name || 'New Tag'}
			{:else}
				New Tag
			{/if}
		</p>
	</nav>
	<Svroller width="100%" height="82vh">
		<form method="POST" use:enhance class="p-4" action={$form.id ? '?/update' : '?/create'}>
			<div class="mb-2 space-y-2">
				<Label for="name">Name</Label>
				<Input
					type="text"
					name="name"
					aria-invalid={$errors.name ? 'true' : undefined}
					bind:value={$form.name}
					{...$constraints.name}
				/>
				<FormError errors={$errors.name} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="description">Description</Label>
				<Textarea
					type="text"
					name="description"
					class="min-h-24"
					aria-invalid={$errors.description ? 'true' : undefined}
					bind:value={$form.description}
					{...$constraints.description}
				/>
				<FormError errors={$errors.description} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="photo">Tag Photo</Label>
				<ImageUpload value={$form.photo} {onUpload} />
				<FormError errors={$errors.photo} />
			</div>
			{#if $errors?._errors}
				<FormError errors={$errors._errors} />
			{/if}
			<div class="flex justify-end">
				<Button type="submit" disabled={isLoading} class="w-full mt-4">
					{isLoading ? 'Loading...' : $form.id ? 'Update' : 'Create'}
				</Button>
			</div>
		</form>
	</Svroller>
</main>

<SEO
	title={`${data.form.data.name || 'New Tag'} - ${PUBLIC_NAME}`}
	description="Effortlessly Manage Tag, Tag, and Post with Zenta Studio for Seamless SEO Integration"
	canonical={`${PUBLIC_DOMAIN}/post/${data.form.data.id}`}
	keywords={`manage, ${data.form.data.name || 'New Tag'}`}
	openGraph={{
		title: `${data.form.data.name || 'New Tag'} - ${PUBLIC_NAME}`,
		description: `Manage ${data.form.data.name || 'New Tag'} post`,
		url: `${PUBLIC_DOMAIN}/post/${data.form.data.id}`,
		type: 'website',
		site_name: `${PUBLIC_NAME}`
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@zenta_studio',
		creator: '@zenta_studio',
		title: `${data.form.data.name || 'New Tag'} - ${PUBLIC_NAME}`,
		description: `Manage ${data.form.data.name || 'New Tag'} post`
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: `${PUBLIC_DOMAIN}/post/${data.form.data.id}`,
		name: `${data.form.data.name || 'New Tag'} - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tag, Tag, and Post with Zenta Studio for Seamless SEO Integration'
	}}
/>
