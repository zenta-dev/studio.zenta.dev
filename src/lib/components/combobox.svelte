<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "$lib/utils.js";
  import { defaultFounderType, type ComboboxInterface } from "@//constants";
  import { tick } from "svelte";
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import Check from "svelte-radix/Check.svelte";

  export let data: ComboboxInterface[] = defaultFounderType;

  export let name: string;

  let open = false;
  export let value = "";

  $: selectedValue =
    data.find((f) => f.value === value)?.label ?? `Select a ${name}...`;

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[200px] justify-between"
    >
      {selectedValue}
      <CaretSort class="w-4 h-4 ml-2 opacity-50 shrink-0" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." class="h-9" />
      <Command.Empty>No {name} found.</Command.Empty>
      <Command.Group>
        {#each data as framework}
          <Command.Item
            value={framework.value}
            onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                value !== framework.value && "text-transparent",
              )}
            />
            {framework.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
