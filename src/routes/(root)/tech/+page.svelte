<script lang="ts">
	import { PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import { Add, Loading, Trash } from '@//assets/icons';
	import { SEO } from '@//components/SEO';
	import { Button } from '@//components/button';
	import { setTechLocal } from '@//store';
	import { Image } from '@unpic/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Svroller } from 'svrollbar';
	import type { PageData } from './$types';

	export let data: PageData;
	let isLoading = false;

	async function deleteTech(id: string) {
		isLoading = true;
		const res = await fetch(`/tech/${id}`, {
			method: 'DELETE'
		});
		const data = await res.json();
		if (data.success) {
			isLoading = false;
			toast.success('Tech deleted successfully', {
				duration: 5000
			});
			window.location.reload();
		} else {
			isLoading = false;
			toast.error('Tech deletion failed', {
				description: data.message,
				duration: 5000
			});
		}
	}

	onMount(() => {
		setTechLocal(data.techs);
	});
</script>

<main class="flex flex-col">
	<div class="flex items-center justify-between p-4 bg-foreground/5">
		<h1 class="text-2xl font-semibold">Tech</h1>
		<a href="/tech/new" class="flex items-center gap-2 p-2 rounded-lg bg-foreground/5">
			<Add class="w-8 h-8" />
			<span> Create </span>
		</a>
	</div>
	<Svroller width="100%" height="49.3rem">
		{#each data.techs as tech}
			<div class="flex items-center p-2 m-2 bg-foreground/5 rounded-xl">
				<a href={`/tech/` + tech.id} class="flex items-center flex-grow gap-4 mr-4">
					<Image
						src={tech.logo || 'https://via.placeholder.com/64'}
						width={64}
						height={64}
						objectFit="contain"
						alt={tech.name}
						class="rounded-xl"
					/>
					<div class="flex-col items-center">
						<h1 class="text-xl font-semibold">{tech.name}</h1>
						<p class="text-sm">
							Update at :
							{new Date(tech.updatedAt || new Date()).toLocaleDateString('en-US', {
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
					on:click={() => deleteTech(tech.id)}
				>
					{#if isLoading}
						<Loading class="w-5 h-5" />
					{:else}
						<Trash class="text-xl text-center text-red-500 " />
					{/if}
				</Button>
			</div>
		{/each}
	</Svroller>
</main>
<SEO
	title={`Techs - ${PUBLIC_NAME}`}
	description="Effortlessly Manage Tech, Tech, and Tech with Zenta Studio for Seamless SEO Integration"
	canonical={`${PUBLIC_DOMAIN}/techs`}
	keywords="zenta studio, seo, tech, tech, tech, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
	openGraph={{
		title: `Techs - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tech, and Tech with Zenta Studio for Seamless SEO Integration',
		url: `${PUBLIC_DOMAIN}/tech`,
		type: 'website',
		site_name: `Techs - ${PUBLIC_NAME}`
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@zenta_studio',
		creator: '@zenta_studio',
		title: `Techs - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tech, and Tech with Zenta Studio for Seamless SEO Integration'
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: `${PUBLIC_DOMAIN}/tech`,
		name: `Techs - ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tech, and Tech with Zenta Studio for Seamless SEO Integration'
	}}
/>
