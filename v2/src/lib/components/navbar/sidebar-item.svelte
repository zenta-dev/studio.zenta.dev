<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '@//utils';

	type Props = {
		href: string;
		class?: string;
	};

	export let href: Props['href'];
	let className: Props['class'] = undefined;

	export { className as class };
	$: active =
		(href === $page.url.pathname || href.includes($page.url.pathname.split('/')[1])) &&
		href !== '/';
</script>

<a
	{href}
	class={cn(
		'flex items-center p-1 gap-2 rounded-xl m-1 hover:shadow-md focus-visible:outline-none justify-center whitespace-nowrap transition-all focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-px active:opacity-85 flex-col',
		active && 'bg-neutral-900 text-emerald-500 font-semibold',
		!active && 'hover:bg-neutral-900 text-muted-foreground',
		className
	)}
	aria-current={active ? 'page' : undefined}
	aria-label="sidebar-item"
	aria-hidden="true"
>
	<slot />
</a>
