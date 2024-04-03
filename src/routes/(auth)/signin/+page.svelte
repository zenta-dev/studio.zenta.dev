<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import { SEO } from '$lib/components/SEO';
	import { Loading } from '@//assets/icons';
	import { Button } from '@//components/button';
	import * as Card from '@//components/card/';
	import { FormError } from '@//components/error/index.js';
	import { Input } from '@//components/input';
	import { Label } from '@//components/label';
	import { Topbar } from '@//components/navbar/index.js';
	import { Separator } from '@//components/separator';
	import { cn } from '@//utils.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types.js';

	export let data: PageData;
	let isLoading = false;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		onSubmit() {
			isLoading = true;
		},
		onResult({ result }) {
			isLoading = false;
			if (result.type === 'success') {
				goto('/');
			}
			if (result.type === 'failure') {
				const { data } = result;
				toast.error(data?.message, {
					description: data?.description,
					duration: 5000
				});
			}
		}
	});
</script>

<div class="flex flex-col h-full">
	<Topbar class="px-8 mt-4 rounded-full bg-foreground/5" />
	<div class="w-full max-w-sm m-auto lg:max-w-lg">
		<form method="POST" use:enhance class="space-y-4">
			<Card.Root class="m-4 ">
				<Card.Header>
					<Card.Title class="text-xl">Sign In</Card.Title>
					<Card.Description>Please sign in to acces Zenta Studio</Card.Description>
				</Card.Header>
				<Separator class="w-[calc(100%-3rem)] mx-auto mb-2" />
				<Card.Content>
					<div class="mb-2 space-y-2">
						<Label for="email">E-mail</Label>
						<Input
							type="email"
							name="email"
							aria-invalid={$errors.email ? 'true' : undefined}
							bind:value={$form.email}
							{...$constraints.email}
						/>
						<FormError errors={$errors.email} />
					</div>
					<div class="mb-2 space-y-2">
						<Label for="password">Password</Label>
						<Input
							type="password"
							name="password"
							aria-invalid={$errors.password ? 'true' : undefined}
							bind:value={$form.password}
							{...$constraints.password}
						/>
						<FormError errors={$errors.password} />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button
						type="submit"
						class={cn('w-full', isLoading && 'text-primary bg-opacity-10 h-12')}
						disabled={isLoading}
					>
						{#if isLoading}
							<div class="flex items-center justify-center gap-2">
								<Loading class="w-8 h-8" />
								<p class="animate-pulse">Loading...</p>
							</div>
						{:else}
							Submit
						{/if}
					</Button>
				</Card.Footer>
			</Card.Root>
		</form>
	</div>
</div>
<SEO
	title={`Sign In - ${PUBLIC_NAME}`}
	description="Sign In to Zenta Studio for Effortless Tech, Tag, and Post Management"
	canonical={`${PUBLIC_DOMAIN}/signin`}
	keywords="sign in, zenta studio, seo, tech, tag, post, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
	openGraph={{
		title: `Sign In - ${PUBLIC_NAME}`,
		description: 'Zenta Studio sign in page',
		url: `${PUBLIC_DOMAIN}/signin`,
		type: 'website',
		site_name: `${PUBLIC_NAME}`
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@zenta_studio',
		creator: '@zenta_studio',
		title: `Sign In - ${PUBLIC_NAME}`,
		description: 'Zenta Studio sign in page'
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		url: `${PUBLIC_DOMAIN}/signin`,
		name: `${PUBLIC_NAME}`,
		description: 'Zenta Studio sign in page'
	}}
/>
