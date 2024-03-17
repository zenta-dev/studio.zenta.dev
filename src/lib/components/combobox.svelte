<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Command from "$lib/components/ui/command";
  import * as Form from "$lib/components/ui/form";
  import * as Popover from "$lib/components/ui/popover";
  import { cn } from "$lib/utils.js";
  import { defaultFounderType, type ComboboxInterface } from "@//constants";
  import { tick } from "svelte";
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import Check from "svelte-radix/Check.svelte";
  import { toast } from "svelte-sonner";
  import type { HTMLInputAttributes } from "svelte/elements";

  export let data: ComboboxInterface[] = defaultFounderType;

  export let name: string;
  export let className: HTMLInputAttributes["class"] = "";

  let open = false;
  export let value = "";
  export let lastValue = "";
  export let index = 0;
  export let isForm = false;
  export let formValue: { id: string | undefined } = { id: undefined };

  $: selectedValue =
    data.find((f) => f.value === value)?.label ?? `Select a ${name}...`;

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<div>
  <Popover.Root bind:open let:ids {...$$restProps}>
    {#if isForm}
      <Form.Control let:attrs>
        <Form.Label
          >{name.charAt(0).toUpperCase() + name.slice(1)}
          {index + 1}</Form.Label
        >
        <Popover.Trigger
          class={cn(
            buttonVariants({ variant: "outline" }),
            "w-full gap-2",
            formValue.id && "text-muted-foreground",
            open && "ring-2 ring-primary",
          )}
          role="combobox"
          {...attrs}
          >{#if value}
            {#if data.find((f) => f.value === value)?.photo}
              <img
                src={data.find((f) => f.value === value)?.photo}
                alt={data.find((f) => f.value === value)?.label}
                class="w-6 h-6 rounded-full"
              />
            {/if}
          {/if}
          {selectedValue}
          <CaretSort class="w-4 h-4 ml-2 opacity-50 shrink-0" />
          <!-- <Button
            builders={[builder]}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            class={cn(
              "w-full gap-2  ",
              className,
              open && "ring-2 ring-primary",
            )}
          >
            
          </Button> -->
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input placeholder={`Search ${name}...`} class="h-9" />
            <Command.Empty>No {name} found.</Command.Empty>
            <Command.Group>
              {#each data as key}
                <Command.Item
                  value={key.value}
                  onSelect={(currentValue) => {
                    // console.log("currentValue : ", currentValue);
                    // console.log("lastValue : ", lastValue);
                    if (index === 0) {
                      value = currentValue;
                      closeAndFocusTrigger(ids.trigger);
                      return;
                    }
                    if (currentValue === lastValue) {
                      toast.error("Duplicate value not allowed");
                      return;
                    }

                    value = currentValue;
                    closeAndFocusTrigger(ids.trigger);
                  }}
                >
                  <Check
                    class={cn(
                      "mr-2 h-4 w-4",
                      value !== key.value && "text-transparent",
                    )}
                  />
                  {key.label}
                </Command.Item>
              {/each}
            </Command.Group>
          </Command.Root>
        </Popover.Content>
      </Form.Control>
    {:else}
      <Popover.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          class={cn("w-full gap-2  ", className, open && "ring-2 ring-primary")}
        >
          {#if value}
            {#if data.find((f) => f.value === value)?.photo}
              <img
                src={data.find((f) => f.value === value)?.photo}
                alt={data.find((f) => f.value === value)?.label}
                class="w-6 h-6 rounded-full"
              />
            {/if}
          {/if}
          {selectedValue}
          <CaretSort class="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Input placeholder={`Search ${name}...`} class="h-9" />
          <Command.Empty>No {name} found.</Command.Empty>
          <Command.Group>
            {#each data as key}
              <Command.Item
                value={key.value}
                onSelect={(currentValue) => {
                  // console.log("currentValue : ", currentValue);
                  // console.log("lastValue : ", lastValue);
                  if (index === 0) {
                    value = currentValue;
                    closeAndFocusTrigger(ids.trigger);
                    return;
                  }
                  if (currentValue === lastValue) {
                    toast.error("Duplicate value not allowed");
                    return;
                  }

                  value = currentValue;
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                <Check
                  class={cn(
                    "mr-2 h-4 w-4",
                    value !== key.value && "text-transparent",
                  )}
                />
                {key.label}
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    {/if}
  </Popover.Root>
</div>
