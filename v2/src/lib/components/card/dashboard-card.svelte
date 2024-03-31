<script lang="ts">
	import { cn } from '@//utils';

	type Props = {
		href: string;
		class?: string;
	};

	export let href: Props['href'];
	let className: Props['class'] = undefined;

	export { className as class };
</script>

<a
	{href}
	class={cn(
		'flex px-8 py-4 gap-2 rounded-xl m-4 hover:shadow-md focus-visible:outline-none justify-center whitespace-nowrap transition-all focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:opacity-85 flex-col min-w-xl border  ease-in-out transform hover:scale-105 text-card-foreground shadow bg-card',
		className
	)}
	{...$$restProps}
	aria-label="dashboard-card"
	aria-hidden="true"
>
	<slot />
</a>
