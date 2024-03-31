<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import { Back } from '@//assets/icons';
	import { SEO } from '@//components/SEO';
	import { Button } from '@//components/button';
	import { Editor } from '@//components/editor';
	import { FormError } from '@//components/error';
	import { Input, Textarea } from '@//components/input';
	import { Label } from '@//components/label';
	import { getTagLocal, getTechLocal, setTagLocal, setTechLocal } from '@//store';

	import { ImageUpload } from '@//components/image';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { Svroller } from 'svrollbar';
	import type { PageData } from './$types';
	import FormCombobox from './(comps)/form-combobox.svelte';

	export let data: PageData;
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
					// Promise.resolve(
					// 	fetch('/api/image/delete', {
					// 		method: 'POST',
					// 		headers: {
					// 			'Content-Type': 'application/json'
					// 		},
					// 		body: JSON.stringify({ url: img })
					// 	})
					// );
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
		if (result.event === 'success') {
			$form.cover = result.info.secure_url;
			toast.success('Image uploaded successfully');
		} else if (result.event === 'error') {
			toast.error('Failed to upload image');
		}
		widget.close();
	}

	onMount(async () => {
		console.log('Mount : ', data);
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
				<ImageUpload value={$form.cover} {onUpload} />
				<FormError errors={$errors.cover} />
			</div>
			<FormCombobox
				label="Authors"
				singularLabel="Author"
				formItems={$form.authors}
				data={data.users}
				errors={$errors.authors}
				onSelected={(i) => {
					if (i.value) {
						$form.authors.push({ id: i.value });
					}
				}}
			/>
			<FormCombobox
				label="Tags"
				singularLabel="Tag"
				formItems={$form.tags}
				data={data.tags}
				errors={$errors.tags}
				onSelected={(i) => {
					if (i.value) {
						$form.tags.push({ id: i.value });
					}
				}}
			/>
			<FormCombobox
				label="Stacks"
				singularLabel="Stack"
				formItems={$form.stacks}
				data={data.stacks}
				errors={$errors.stacks}
				onSelected={(i) => {
					if (i.value) {
						$form.stacks.push({ id: i.value });
					}
				}}
			/>

			<div class="mb-2 space-y-2">
				<Label for="content">Content</Label>
				<Editor bind:value={$form.content} />
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
