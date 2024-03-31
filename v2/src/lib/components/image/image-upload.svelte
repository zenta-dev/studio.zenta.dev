<script lang="ts">
	import { PUBLIC_CLODINARY_UPLOAD_PRESET } from '$env/static/public';
	import { Add } from '@//assets/icons';
	import { Textarea } from '@//components/input';
	import { cn } from '@//utils';
	import { CldImage, CldUploadWidget } from 'svelte-cloudinary';

	export let value: string | undefined;
	export let onUpload: (result: any, widget: any) => void;
	console.log({ value });
</script>

<div class={cn('h-full', value === '' || value === undefined ? 'flex' : 'relative')}>
	{#if value}
		<div class={cn('rounded-xl', value === '' || value === undefined ? 'hidden' : 'relative')}>
			<CldImage
				src={value}
				alt="cover"
				width={640}
				height={352}
				crop="fill"
				aspectRatio={16 / 9}
				class="h-[calc(22rem)] w-[calc(40rem)] rounded-xl"
				gravity="center"
				fetchpriority="low"
			/>
			<Textarea
				class={cn(
					'z-10 h-20 rounded-xl bottom-1 sm:h-16 md:h-12 lg:h-10 bg-neutral-900 ',
					value === '' || value === undefined ? 'flex' : 'absolute'
				)}
				bind:value
			/>
			<div
				class={cn(
					' inset-0 bg-black opacity-50 rounded-xl',
					value === '' || value === undefined ? 'hidden' : 'absolute'
				)}
			></div>
		</div>
	{/if}
	<CldUploadWidget
		uploadPreset={PUBLIC_CLODINARY_UPLOAD_PRESET}
		let:open
		options={{
			sources: ['local', 'url', 'unsplash'],
			multiple: false,
			maxFiles: 1,
			showAdvancedOptions: true,
			cropping: true,
			showPoweredBy: false,
			styles: {
				palette: {
					window: '#121212',
					sourceBg: '#1D1D1D',
					windowBorder: '#E5E7EB',
					tabIcon: '#10B981',
					inactiveTabIcon: '#737373',
					menuIcons: '#10B981',
					link: '#10B981',
					action: '#362594',
					inProgress: '#00ffcc',
					complete: '#33ff00',
					error: '#cc3333',
					textDark: '#000000',
					textLight: '#ffffff'
				},
				frame: {
					background: '#080808'
				}
			}
		}}
		signatureEndpoint="/api/image/upload"
		{onUpload}
	>
		<div
			class={cn(
				'flex items-center justify-center w-full top-1/3',
				value === '' || value === undefined ? 'flex' : 'absolute'
			)}
		>
			<button class="" on:click={open} type="button">
				<div class="p-8 border border-white rounded-lg bg-white/50">
					<div class="flex items-center justify-center w-full h-full">
						<Add class="w-8 h-8" />
					</div>
				</div>
			</button>
		</div>
	</CldUploadWidget>
</div>
