<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import { Add, Back } from '@//assets/icons';
	import { SEO } from '@//components/SEO';
	import { Button } from '@//components/button';
	import { FormError } from '@//components/error';
	import { Input, Textarea } from '@//components/input';
	import { Label } from '@//components/label';
	import { imgStore } from '@//store';

	import { ImageUpload } from '@//components/image';
	import { Separator } from '@//components/separator';
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
					toast.success('Tech updated successfully');
				} else {
					toast.success('Tech created successfully');
				}
				setTimeout(() => {
					goto('/tech');
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
			$form.logo = result.info.secure_url;
			imgStore.set(result.info.secure_url);
			toast.success('Image uploaded successfully');
		} else if (result.event === 'error') {
			toast.error('Failed to upload image');
		}
		widget.close();
	}
	onMount(async () => {
		imgStore.set($form.logo);
		imgStore.subscribe((value) => {
			img = value;
		});
	});
</script>

<main class="flex flex-col">
	<nav class="flex items-center gap-4 p-4 bg-foreground/5">
		<a href="/tech" class="text-xl text-center"><Back /></a>
		<p class="text-xl font-semibold text-center">
			{#if data.form.data.name || 'New Tech'}
				{data.form.data.name || 'New Tech'.length > 20
					? data.form.data.name || 'New Tech'.slice(0, 20) + '...'
					: data.form.data.name || 'New Tech'}
			{:else}
				New Tech
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
				<Label for="logo">Tech Logo</Label>
				<ImageUpload value={$form.logo} {onUpload} />
				<FormError errors={$errors.logo} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="founder.name">Founder Name</Label>
				<Input
					type="text"
					name="founder.name"
					aria-invalid={$errors.founder?.name ? 'true' : undefined}
					bind:value={$form.founder.name}
					{...$constraints.founder?.name}
				/>
				<FormError errors={$errors.description} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="founder.url">Founder Wiki Url</Label>
				<Input
					type="text"
					name="founder.url"
					aria-invalid={$errors.founder?.url ? 'true' : undefined}
					bind:value={$form.founder.url}
					{...$constraints.founder?.url}
				/>
				<FormError errors={$errors.description} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="url">Founder Wiki Url</Label>
				<Input
					type="text"
					name="url"
					aria-invalid={$errors.url ? 'true' : undefined}
					bind:value={$form.url}
					{...$constraints.url}
				/>
				<FormError errors={$errors.description} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="homepage">Founder Home Page Url</Label>
				<Input
					type="text"
					name="homepage"
					aria-invalid={$errors.homepage ? 'true' : undefined}
					bind:value={$form.homepage}
					{...$constraints.homepage}
				/>
				<FormError errors={$errors.description} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="founder.photo">Founder Photo</Label>
				<ImageUpload value={$form.founder.photo} {onUpload} />
			</div>
			<Label class="mt-4">Tech Version</Label>
			<div class="grid grid-cols-1 gap-4 p-2 mt-4 border rounded-lg">
				{#each $form.versions as v, i}
					<Label class="px-2">Version {v.version}</Label>
					<div class="p-2 border rounded-lg">
						<div class="mb-2 space-y-2">
							<Input
								type="number"
								step="0.01"
								aria-invalid={$errors.versions ? 'true' : undefined}
								bind:value={v.version}
							/>
						</div>
						<div class="mb-2 space-y-2">
							<Label>Version Description</Label>
							<Textarea
								type="text"
								class="min-h-12"
								aria-invalid={$errors.versions ? 'true' : undefined}
								bind:value={v.description}
							/>
						</div>
						<div class="mb-2 space-y-2">
							<Label>What News</Label>
							<Textarea
								type="text"
								class="min-h-24"
								aria-invalid={$errors.versions ? 'true' : undefined}
								bind:value={v.whatNews}
							/>
						</div>
						<div class="mb-2 space-y-2">
							<Label>Version Url</Label>
							<Input
								type="text"
								aria-invalid={$errors.versions ? 'true' : undefined}
								bind:value={v.url}
							/>
						</div>
					</div>
					<Separator />
					{#if i === $form.versions.length - 1}
						<div class="p-2 border rounded-lg">
							<div class="flex items-center justify-center w-full h-full">
								<Button
									variant="ghost"
									size="sm"
									aria-label="add"
									on:click={() => {
										$form.versions = [...$form.versions, { version: 0 }];
									}}
								>
									<Add class="w-8 h-8" />
								</Button>
							</div>
						</div>
					{/if}
				{/each}
				{#if $form.versions.length === 0}
					<div class="p-2 border rounded-lg">
						<div class="flex items-center justify-center w-full h-full">
							<Button
								variant="ghost"
								size="sm"
								aria-label="add"
								on:click={() => {
									$form.versions = [...$form.versions, { version: 0 }];
								}}
							>
								<Add class="w-8 h-8" />
							</Button>
						</div>
					</div>
				{/if}
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
	title={`${data.form.data.name || 'New Tech'} - ${PUBLIC_NAME}`}
	description="Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration"
	canonical={`${PUBLIC_DOMAIN}/post/${data.form.data.id}`}
	keywords={`manage, ${data.form.data.name || 'New Tech'}`}
	openGraph={{
		title: `${data.form.data.name || 'New Tech'} - ${PUBLIC_NAME}`,
		description: `Manage ${data.form.data.name || 'New Tech'} post`,
		url: `${PUBLIC_DOMAIN}/post/${data.form.data.id}`,
		type: 'website',
		site_name: `${PUBLIC_NAME}`
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@zenta_studio',
		creator: '@zenta_studio',
		title: `${data.form.data.name || 'New Tech'} - ${PUBLIC_NAME}`,
		description: `Manage ${data.form.data.name || 'New Tech'} post`
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: `${PUBLIC_DOMAIN}/post/${data.form.data.id}`,
		name: `${data.form.data.name || 'New Tech'} - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration'
	}}
/>
