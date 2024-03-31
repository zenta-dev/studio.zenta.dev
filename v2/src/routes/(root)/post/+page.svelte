<script lang="ts">
	import { PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import { Add, Loading, Trash } from '@//assets/icons';
	import { SEO } from '@//components/SEO';
	import { Button } from '@//components/button';
	import { getTagLocal, setPostLocal } from '@//store';
	import { Image } from '@unpic/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	export let data: PageData;
	let isLoading = false;
	let isTagAvailable = false;
	let isTechAvailable = false;

	async function deletePost(id: string) {
		isLoading = true;
		const res = await fetch(`/post/${id}`, {
			method: 'DELETE'
		});
		const data = await res.json();
		if (data.success) {
			isLoading = false;
			toast.success('Post deleted successfully', {
				duration: 5000
			});
			window.location.reload();
		} else {
			isLoading = false;
			toast.error('Post deletion failed', {
				description: data.message,
				duration: 5000
			});
		}
	}

	onMount(() => {
		setPostLocal(data.posts);
		const tags = getTagLocal();
		if (tags === null || tags?.length === 0) {
			isTagAvailable = false;
		} else {
			isTagAvailable = true;
		}

		const techs = getTagLocal();
		if (techs === null || techs?.length === 0) {
			isTechAvailable = false;
		} else {
			isTechAvailable = true;
		}
	});
</script>

<main class="flex flex-col">
	<nav class="flex items-center justify-between p-4 bg-foreground/5">
		<a href="/post" class="text-2xl font-semibold">Post</a>
		<a href="/post/new" class="flex items-center gap-2 p-2 rounded-lg bg-foreground/5">
			<Add class="w-8 h-8" />
			<span> Create </span>
		</a>
	</nav>
	{#each data.posts as post}
		<div class="flex items-center p-2 m-2 bg-foreground/5 rounded-xl">
			<a
				href={`/post/` + post.id + `?tag=${isTagAvailable}&tech=${isTechAvailable}`}
				class="flex items-center flex-grow gap-4 mr-4"
			>
				<Image
					src={post.cover || 'https://via.placeholder.com/64'}
					width={64}
					height={64}
					objectFit="contain"
					alt={post.title}
					class="rounded-xl"
				/>
				<div class="flex-col items-center">
					<h1 class="text-xl font-semibold">
						{post.title.length > 20 ? post.title.slice(0, 20) + '...' : post.title}
					</h1>
					<p class="text-sm">
						Update at :
						{new Date(post.updatedAt || new Date()).toLocaleDateString('en-US', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})}
					</p>
				</div></a
			>
			<!-- spacer -->
			<!-- <span class="flex-grow"></span> -->

			<Button
				class="px-2 mr-2 rounded-lg bg-foreground/5"
				variant="ghost"
				on:click={() => deletePost(post.id)}
			>
				{#if isLoading}
					<Loading class="w-5 h-5" />
				{:else}
					<Trash class="text-xl text-center text-red-500 " />
				{/if}
			</Button>
		</div>
	{/each}
</main>

<SEO
	title={`Posts - ${PUBLIC_NAME}`}
	description="Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration"
	canonical={`${PUBLIC_DOMAIN}/post`}
	keywords="zenta studio, seo, tech, tag, post, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
	openGraph={{
		title: `Posts - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration',
		url: `${PUBLIC_DOMAIN}/post`,
		type: 'website',
		site_name: `${PUBLIC_NAME}`
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@zenta_studio',
		creator: '@zenta_studio',
		title: `Posts - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration'
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: `${PUBLIC_DOMAIN}/post`,
		name: `Posts - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration'
	}}
/>
