<script lang="ts">
	import type { Thing, WithContext } from 'schema-dts';
	import OpenGraphComponent from './open-graph.svelte';
	import type { Facebook, OpenGraph, Twitter } from './type';

	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let keywords: string | undefined = undefined;
	export let base: string | undefined = undefined;
	export let applicationName: string | undefined = undefined;
	export let themeColor: string | undefined = undefined;
	export let nofollow: boolean = false;
	export let noindex: boolean = false;
	export let nositelinkssearchbox = false;
	export let notranslate: boolean = false;
	export let canonical: string | undefined = undefined;
	export let amp: string | undefined = undefined;
	export let manifest: string | undefined = undefined;
	export let languageAlternates: Array<{ hreflang: string; href: string }> | undefined = undefined;
	export let twitter: Twitter | undefined = undefined;
	export let openGraph: OpenGraph | undefined = undefined;
	export let facebook: Facebook | undefined = undefined;
	export let jsonLd: Thing | WithContext<Thing> | undefined = undefined;
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}

	{#if description}
		<meta name="description" content={description} />
	{/if}

	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}

	{#if amp}
		<link rel="amphtml" href={amp} />
	{/if}

	{#if manifest}
		<link rel="manifest" href={manifest} />
	{/if}

	{#if applicationName}
		<meta name="application-name" content={applicationName} />
	{/if}

	{#if languageAlternates}
		{#each languageAlternates as { href, hreflang }}
			<link rel="alternate" {href} {hreflang} />
		{/each}
	{/if}

	{#if themeColor}
		<meta name="theme-color" content={themeColor} />
	{/if}

	{#if base}
		<base href={base} />
	{/if}

	{#if facebook?.appId}
		<meta property="fb:app_id" content={facebook.appId} />
	{/if}

	<meta
		name="robots"
		content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`}
	/>
	<meta
		name="googlebot"
		content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`}
	/>

	{#if nositelinkssearchbox}
		<meta name="google" content="nositelinkssearchbox" />
	{/if}

	{#if notranslate}
		<meta name="google" content="notranslate" />
	{/if}

	{#if twitter}
		{#each Object.entries(twitter) as [key, value]}
			{@const transformed = key.replace(/([a-z])([A-Z])/g, '$1:$2').toLowerCase()}
			<!-- The `transformed` variable changes eg, twitter.title into twitter:title
                It loops over all the properties and changes the '.' into ':'
            -->
			<meta name="twitter:{transformed}" content={value} />
		{/each}
	{/if}

	{#if openGraph}
		<OpenGraphComponent {openGraph} />
	{/if}

	{#if jsonLd}
		{@const data = Object.assign({ '@context': 'https://schema.org' }, jsonLd)}
		{@html `<script type="application/ld+json">${JSON.stringify(data) + '<'}/script>`}
	{/if}

	<slot />
</svelte:head>
