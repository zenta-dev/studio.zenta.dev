<script lang="ts">
	import { PUBLIC_DOMAIN, PUBLIC_NAME } from '$env/static/public';
	import postImage from '@//assets/banner/card/post.png?enhanced';
	import tagImage from '@//assets/banner/card/tag.jpg?enhanced';
	import techImage from '@//assets/banner/card/tech.png?enhanced';
	import { Document, Tag, Tech } from '@//assets/icons';
	import { SEO } from '@//components/SEO';
	import { DashboardCard } from '@//components/card';
	import DashboardCardContent from '@//components/card/dashboard-card-content.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="grid pt-4">
	<DashboardCard href="/tag" class="hover:border-green-500 bg-url">
		<DashboardCardContent title="Tag" class="text-green-500">
			<Tag class="text-xl" />
			<div slot="count" class="flex flex-col items-center gap-4 my-2 text-foreground">
				<h1 class="text-5xl font-semibold">
					{data.tagCount}
				</h1>
				<p>Tags</p>
			</div>
			<enhanced:img
				src={tagImage}
				alt="Tag"
				class="absolute top-0 left-0 object-cover w-full h-full opacity-20 rounded-xl -z-50"
			/>
		</DashboardCardContent>
	</DashboardCard>
	<DashboardCard href="/tech" class="hover:border-sky-500">
		<DashboardCardContent title="Tech" class="text-sky-500 ">
			<Tech class="text-xl" />
			<div slot="count" class="flex flex-col items-center gap-4 my-2 text-foreground">
				<h1 class="text-5xl font-semibold">
					{data.techCount}
				</h1>
				<p>Stacks</p>
			</div>
		</DashboardCardContent>
		<enhanced:img
			src={techImage}
			alt="Tag"
			class="absolute top-0 left-0 object-cover w-full h-full opacity-20 rounded-xl -z-50"
		/>
	</DashboardCard>
	<DashboardCard href="/post" class="hover:border-violet-500">
		<DashboardCardContent title="Post" class="text-violet-500">
			<Document class="text-xl" />
			<div slot="count" class="flex flex-col items-center gap-4 my-2 text-foreground">
				<h1 class="text-5xl font-semibold">
					{data.postCount}
				</h1>
				<p>Posts</p>
			</div>
		</DashboardCardContent>
		<enhanced:img
			src={postImage}
			alt="Tag"
			class="absolute top-0 left-0 object-cover w-full h-full opacity-20 rounded-xl -z-50"
		/>
	</DashboardCard>
</main>

<SEO
	title={`Dashboard | ${PUBLIC_NAME}`}
	description="Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration"
	canonical={`${PUBLIC_DOMAIN}/`}
	keywords="dashboard, zenta studio, seo, tech, tag, post, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
	openGraph={{
		title: `Dashboard | ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration',
		url: `${PUBLIC_DOMAIN}/`,
		type: 'website',
		site_name: `${PUBLIC_NAME}`
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@zenta_studio',
		creator: '@zenta_studio',
		title: `Dashboard | ${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration'
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: `${PUBLIC_DOMAIN}/`,
		name: `${PUBLIC_NAME}`,
		description:
			'Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration'
	}}
/>
