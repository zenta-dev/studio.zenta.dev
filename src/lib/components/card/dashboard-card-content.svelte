<script lang="ts">
	import { cn } from '@//utils';

	type Props = {
		class?: string;
		title: string;
	};

	let className: Props['class'] = undefined;
	export let title: Props['title'];

	export { className as class };
</script>

<div class={cn('flex flex-col', className)} {...$$restProps}>
	<div class="flex items-center gap-2 text-xl font-medium">
		<slot />
		<h1>{title}</h1>
	</div>
	<div>
		<slot name="count" />
	</div>
</div>
