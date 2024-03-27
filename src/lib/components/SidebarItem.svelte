<script lang="ts">
  import { page } from "$app/stores";
  import { cn } from "@//utils.js";

  export let className: string | undefined = undefined;
  export let isButton: boolean = false;
  export let buttonActive: boolean = false;
  export let onClick: () => void = () => {};

  export let href: string = "";
  $: active = href === $page.url.pathname;
</script>

{#if isButton}
  <div
    class={cn(
      "flex items-center rounded-lg justify-between  gap-2",
      buttonActive && "bg-neutral-900",
      !buttonActive && "hover:bg-neutral-900",
      className,
    )}
  >
    <button
      {...$$props}
      on:click={onClick}
      class={cn(
        "flex items-center rounded-lg justify-between w-ful",
        buttonActive && "bg-neutral-900",
        !buttonActive && "hover:bg-neutral-900",
        className,
      )}
    >
      <slot />
    </button>
    <slot name="action" />
  </div>
{:else}
  <a
    {...$$props}
    {href}
    aria-current={active ? "page" : undefined}
    class:active
    class={cn(
      "flex items-center   p-2  rounded-lg gap-2",
      active && "bg-neutral-900",
      !active && "hover:bg-neutral-900",
      className,
    )}
  >
    <slot />
  </a>
{/if}
