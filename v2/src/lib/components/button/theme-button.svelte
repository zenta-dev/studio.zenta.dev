<script lang="ts">
	import { browser } from '$app/environment';
	import { cn } from '@//utils';
	import { mode, toggleMode } from 'mode-watcher';
	import { onDestroy, onMount } from 'svelte';

	let btn: HTMLInputElement;

	onMount(() => {
		if (browser) {
			btn.addEventListener('change', changeTheme);
			if ($mode === 'dark') {
				btn.checked = true;
			}
		}
	});

	function changeTheme() {
		console.log('Recent mode:', $mode);
		setTimeout(() => {
			toggleMode();
		}, 300);
	}

	onDestroy(() => {
		if (browser) {
			btn.removeEventListener('change', changeTheme);
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/theme-toggles@4.10.1/css/expand.min.css"
	/>
</svelte:head>

<label class="theme-toggle" title="Toggle theme">
	<input bind:this={btn} type="checkbox" />
	<span class="theme-toggle-sr">Toggle theme</span>
	<svg
		class={cn(
			'theme-toggle__expand duration-75',
			$mode === 'dark' ? 'text-[#87CEEB]' : 'text-[#fcba03]'
		)}
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		width="2em"
		height="2em"
		fill="currentColor"
		viewBox="0 0 32 32"
	>
		<clipPath id="theme-toggle__expand__cutout">
			<path d="M0-11h25a1 1 0 0017 13v30H0Z" />
		</clipPath>
		<g clip-path="url(#theme-toggle__expand__cutout)">
			<circle cx="16" cy="16" r="8.4" />
			<path
				d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z"
			/>
		</g>
	</svg>
</label>
