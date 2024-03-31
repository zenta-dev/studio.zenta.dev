<script lang="ts">
	import { browser } from '$app/environment';
	import { cn } from '@//utils';
	import { onDestroy, onMount } from 'svelte';
	import { Brand } from '.';
	import ThemeButton from '../button/theme-button.svelte';

	let screenWidth = 0;

	const handleResize = () => {
		screenWidth = window.innerWidth;
	};

	onMount(() => {
		if (browser) {
			handleResize();
			window.addEventListener('resize', handleResize);
			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', handleResize);
		}
	});

	type Props = {
		class?: string;
	};

	let className: Props['class'] = undefined;
	export { className as class };
</script>

<nav
	class={cn(
		'flex justify-between p-4 container max-w-xl lg:max-w-5xl',
		className, 
		screenWidth < 768 && `fixed bottom-0 left-0 right-0 z-50`
	)}
>
	<Brand />
	<div class="p-2 rounded-xl bg-foreground/10">
		<ThemeButton />
	</div>
</nav>
