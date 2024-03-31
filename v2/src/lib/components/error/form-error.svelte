<script lang="ts">
	export let errors: string[] | undefined;
</script>

{#if errors}
	<div class="text-[0.8rem] font-medium text-destructive">
		{#each errors as error}
			<div>{error}</div>
		{/each}
	</div>
{/if}
