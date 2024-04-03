<script lang="ts">
	import { cn } from '@//utils';
	import { buttonVariants, type ButtonEvents, type ButtonProps } from '.';

	type $$Props = ButtonProps;
	type $$Events = ButtonEvents;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';

	export { className as class };
</script>

<button
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</button>
