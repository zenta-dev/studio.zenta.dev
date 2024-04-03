<script lang="ts">
	import { cn } from '@//utils';
	import type { LabelProps } from '.';

	type $$Props = LabelProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<label
	class={cn(
		'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...$$restProps}
>
	<slot />
</label>
