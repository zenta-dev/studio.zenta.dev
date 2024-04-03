<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SeparatorProps } from '.';

	type $$Props = SeparatorProps;

	let className: $$Props['class'] = undefined;
	export let orientation: $$Props['orientation'] = 'horizontal';
	export { className as class };
</script>

<div
	class={cn(
		'shrink-0 bg-border',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
		className
	)}
	{...$$restProps}
/>
