<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_CLODINARY_UPLOAD_PRESET, PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import { Add, Back } from '@//assets/icons';
	import { SEO } from '@//components/SEO';
	import { Button } from '@//components/button';
	import { Editor } from '@//components/editor';
	import { FormError } from '@//components/error';
	import { Input, Textarea } from '@//components/input';
	import { Label } from '@//components/label';
	import { getTagLocal, getTechLocal, setTagLocal, setTechLocal } from '@//store';
	import { onMount } from 'svelte';
	import { CldImage, CldUploadWidget } from 'svelte-cloudinary';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { Svroller } from 'svrollbar';
	import type { PageData } from './$types';
	import Combobox from './combobox.svelte';

	export let data: PageData;
	let isLoading = false;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		dataType: 'json',
		onSubmit() {
			isLoading = true;
		},
		onResult({ result }) {
			console.log(result);
			isLoading = false;
			if (result.type === 'success') {
				if ($form.id) {
					toast.success('Post updated successfully');
				} else {
					toast.success('Post created successfully');
				}
				setTimeout(() => {
					goto('/post');
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
		console.log(result);
		if (result.event === 'success') {
			console.log(result.info.secure_url);
			$form.cover = result.info.secure_url;
			toast.success('Image uploaded successfully');
		} else if (result.event === 'error') {
			toast.error('Failed to upload image');
		}
		widget.close();
	}

	onMount(async () => {
		if (data.tags === undefined) {
			const tagL = JSON.parse(getTagLocal() || '{}');
			if (tagL.expiredAt < Date.now()) {
				const res = await fetch('/api/tags');
				const json = await res.json();
				if (json.success) {
					data.tags = json.tags;
					setTagLocal(json.tags);
				}
			} else {
				data.tags = tagL.data;
			}
		}

		if (data.stacks === undefined) {
			const techL = JSON.parse(getTechLocal() || '{}');
			if (techL.expiredAt < Date.now()) {
				const res = await fetch('/api/techs');
				const json = await res.json();
				if (json.success) {
					data.stacks = json.techs;
					setTechLocal(json.techs);
				}
			} else {
				data.stacks = techL.data;
				console.log(data);
			}
		}
	});
</script>

<main class="flex flex-col">
	<nav class="flex items-center gap-4 p-4 bg-foreground/5">
		<a href="/post" class="text-xl text-center"><Back /></a>
		<p class="text-xl font-semibold text-center">
			{#if data.form.data.title}
				{data.form.data.title.length > 20
					? data.form.data.title.slice(0, 20) + '...'
					: data.form.data.title}
			{:else}
				New Post
			{/if}
		</p>
	</nav>
	<Svroller width="100%" height="82vh">
		<form method="POST" use:enhance class="p-4" action={$form.id ? '?/update' : '?/create'}>
			<div class="mb-2 space-y-2">
				<Label for="title">Title</Label>
				<Input
					type="text"
					name="title"
					aria-invalid={$errors.title ? 'true' : undefined}
					bind:value={$form.title}
					{...$constraints.title}
				/>
				<FormError errors={$errors.title} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="summary">Summary</Label>
				<Textarea
					type="text"
					name="summary"
					class="min-h-24"
					aria-invalid={$errors.summary ? 'true' : undefined}
					bind:value={$form.summary}
					{...$constraints.summary}
				/>
				<FormError errors={$errors.summary} />
			</div>
			<div class="mb-2 space-y-2">
				<Label for="cover">Cover</Label>
				{#if $form.cover}
					<CldImage
						src={$form.cover}
						alt="cover"
						width="1280px"
						height="360"
						crop="fill"
						class=" h-[calc(22rem)] w-[calc(80rem)] rounded-xl"
						gravity="center"
					/>
				{/if}
				<CldUploadWidget
					{...$constraints.cover}
					bind:value={$form.cover}
					uploadPreset={PUBLIC_CLODINARY_UPLOAD_PRESET}
					let:open
					options={{
						sources: ['local', 'url', 'unsplash'],
						multiple: false,
						maxFiles: 1
					}}
					signatureEndpoint="/api/upload"
					{onUpload}
					style="background: none;"
				>
					<div class="flex items-center justify-center w-full">
						<button class="" on:click={open}>
							<div class="p-8 border rounded-lg">
								<div class="flex items-center justify-center w-full h-full">
									<Add class="w-8 h-8" />
								</div>
							</div>
						</button>
					</div>
				</CldUploadWidget>
				<FormError errors={$errors.cover} />
			</div>

			<Label for="authors">
				{#if $form.authors.length > 1}
					Authors
				{:else}
					Author
				{/if}
			</Label>
			<div class="p-2 mx-8 my-4 mb-2 space-y-2 border rounded-lg">
				{#each $form.authors as author, i}
					<div class="flex flex-col items-center w-full gap-2">
						<Combobox
							items={data.users.map((e) => {
								return {
									label: e.name || 'Undefined',
									value: e.id,
									photo: e.photo
								};
							})}
							selectedItems={$form.authors.map((e) => {
								return e.id;
							})}
							value={{
								value: author.id,
								label: data.users.find((e) => e.id === author.id)?.name || 'Select an author...',
								photo: data.users.find((e) => e.id === author.id)?.photo
							}}
							onSelected={(item) => {
								if (item.value) {
									$form.authors[i].id = item.value;
								} else {
									toast.error('Please select an author');
								}
							}}
						/>
					</div>
					{#if i === $form.authors.length - 1}
						<div class="flex items-center justify-center w-full h-full">
							<Button
								variant="ghost"
								size="sm"
								aria-label="add"
								on:click={() => {
									if ($form.authors[i].id === '') {
										toast.error('Please fill the previous author');
										return;
									}
									$form.authors = [...$form.authors, { id: '' }];
								}}
							>
								<Add class="w-8 h-8" />
							</Button>
						</div>
					{/if}
				{/each}
				{#if $form.authors.length === 0}
					<div class="border rounded-lg">
						<div class="flex items-center justify-center w-full h-full">
							<Button
								variant="ghost"
								size="sm"
								aria-label="add"
								on:click={() => {
									$form.authors = [...$form.authors, { id: '' }];
								}}
							>
								<Add class="w-8 h-8" />
							</Button>
						</div>
					</div>
				{/if}
				{#if $errors.authors?._errors}
					<FormError errors={$errors.authors._errors} />
				{/if}
			</div>
			<Label for="tags">
				{#if $form.tags.length > 1}
					Tags
				{:else}
					Tag
				{/if}
			</Label>
			<div class="p-2 mx-8 my-4 mb-2 space-y-2 border rounded-lg">
				{#each $form.tags as tag, i}
					<div class="flex flex-col items-center w-full gap-2">
						<Combobox
							items={data.tags?.map((e) => {
								return {
									label: e.name || 'Undefined',
									value: e.id,
									photo: e.photo
								};
							}) || []}
							selectedItems={$form.tags.map((e) => {
								return e.id;
							})}
							value={{
								value: tag.id,
								label: data.tags?.find((e) => e.id === tag.id)?.name || 'Select an tag...',
								photo: data.tags?.find((e) => e.id === tag.id)?.photo
							}}
							onSelected={(item) => {
								if (item.value) {
									$form.tags[i].id = item.value;
								} else {
									toast.error('Please select an tag');
								}
							}}
						/>
					</div>
					{#if i === $form.tags.length - 1}
						<div class="flex items-center justify-center w-full h-full">
							<Button
								variant="ghost"
								size="sm"
								aria-label="add"
								on:click={() => {
									if ($form.tags[i].id === '') {
										toast.error('Please fill the previous tag');
										return;
									}
									$form.tags = [...$form.tags, { id: '' }];
								}}
							>
								<Add class="w-8 h-8" />
							</Button>
						</div>
					{/if}
				{/each}
				{#if $form.tags.length === 0}
					<div class="border rounded-lg">
						<div class="flex items-center justify-center w-full h-full">
							<Button
								variant="ghost"
								size="sm"
								aria-label="add"
								on:click={() => {
									$form.tags = [...$form.tags, { id: '' }];
								}}
							>
								<Add class="w-8 h-8" />
							</Button>
						</div>
					</div>
				{/if}
				{#if $errors.tags?._errors}
					<FormError errors={$errors.tags._errors} />
				{/if}
			</div>
			<Label for="stacks">
				{#if $form.stacks.length > 1}
					Stacks
				{:else}
					Stack
				{/if}
			</Label>
			<div class="p-2 mx-8 my-4 mb-2 space-y-2 border rounded-lg">
				{#each $form.stacks as stack, i}
					<div class="flex flex-col items-center w-full gap-2">
						<Combobox
							items={data.stacks?.map((e) => {
								return {
									label: e.name || 'Undefined',
									value: e.id,
									photo: e.logo
								};
							}) || []}
							selectedItems={$form.stacks.map((e) => {
								return e.id;
							})}
							value={{
								value: stack.id,
								label: data.stacks?.find((e) => e.id === stack.id)?.name || 'Select an stack...',
								photo: data.stacks?.find((e) => e.id === stack.id)?.logo
							}}
							onSelected={(item) => {
								if (item.value) {
									$form.stacks[i].id = item.value;
								} else {
									toast.error('Please select an stack');
								}
							}}
						/>
					</div>
					{#if i === $form.stacks.length - 1}
						<div class="flex items-center justify-center w-full h-full">
							<Button
								variant="ghost"
								size="sm"
								aria-label="add"
								on:click={() => {
									if ($form.stacks[i].id === '') {
										toast.error('Please fill the previous stack');
										return;
									}
									$form.stacks = [...$form.stacks, { id: '' }];
								}}
							>
								<Add class="w-8 h-8" />
							</Button>
						</div>
					{/if}
				{/each}
				{#if $form.stacks.length === 0}
					<div class="border rounded-lg">
						<div class="flex items-center justify-center w-full h-full">
							<Button
								variant="ghost"
								size="sm"
								aria-label="add"
								on:click={() => {
									$form.stacks = [...$form.stacks, { id: '' }];
								}}
							>
								<Add class="w-8 h-8" />
							</Button>
						</div>
					</div>
				{/if}
				{#if $errors.stacks?._errors}
					<FormError errors={$errors.stacks._errors} />
				{/if}
			</div>
			<div class="mb-2 space-y-2">
				<Label for="content">Content</Label>
				<Editor bind:value={$form.content} {...$constraints.content} />
				<FormError errors={$errors.content} />
			</div>
			<div class="flex justify-end">
				<Button type="submit" disabled={isLoading} class="w-full mt-4">
					{isLoading ? 'Loading...' : $form.id ? 'Update' : 'Create'}
				</Button>
			</div>
		</form>
	</Svroller>
</main>

<SEO
	title={`${data.form.data.title} - ${PUBLIC_NAME}`}
	description="Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration"
	canonical={`${PUBLIC_DOMAIN}/post/${data.form.data.id}`}
	keywords={`manage, ${data.form.data.title}`}
	openGraph={{
		title: `${data.form.data.title} - ${PUBLIC_NAME}`,
		description: `Manage ${data.form.data.title} post`,
		url: `${PUBLIC_DOMAIN}/post/${data.form.data.id}`,
		type: 'website',
		site_name: `${PUBLIC_NAME}`
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@zenta_studio',
		creator: '@zenta_studio',
		title: `${data.form.data.title} - ${PUBLIC_NAME}`,
		description: `Manage ${data.form.data.title} post`
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: `${PUBLIC_DOMAIN}/post/${data.form.data.id}`,
		name: `${data.form.data.title} - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration'
	}}
/>
