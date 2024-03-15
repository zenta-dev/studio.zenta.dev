<script lang="ts">
  import { goto } from "$app/navigation";
  import { cn } from "$lib/utils.js.js";
  import AspectRatio from "@//components/ui/aspect-ratio/aspect-ratio.svelte";
  import * as Form from "@//components/ui/form";
  import { Input } from "@//components/ui/input";
  import ScrollArea from "@//components/ui/scroll-area/scroll-area.svelte";
  import Textarea from "@//components/ui/textarea/textarea.svelte";
  import { toast } from "svelte-sonner";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { type TagFormSchema } from "./schema";

  export let data: SuperValidated<Infer<TagFormSchema>>;

  const form = superForm(data, {
    dataType: "json",
    onError({ result }) {
      if (!result.error) return;

      return toast.error(result.error.message, {
        description: result.error.description,
        duration: 5000,
      });
    },
    onResult({ result }) {
      if (result.type === "success") {
        toast.success(result.data?.form.message.message, {
          description: result.data?.form.message.description,
          duration: 5000,
        });
        goto("/");
      }
    },
  });

  const { form: formData, enhance } = form;
</script>

<ScrollArea class="w-full">
  <form method="post" use:enhance class={cn("w-full p-8 ")}>
    <form.label>Photo</form.label>
    <div class="flex flex-col p-4 mt-4 space-y-4 border rounded-lg">
      <Form.Field {form} name="photo">
        <Form.Control let:attrs>
          <div class="container items-center w-64">
            <AspectRatio ratio={1 / 1}>
              <img
                src={$formData.photo}
                alt="Gray by Drew Beamer"
                class="object-cover w-full h-full rounded-md"
              />
            </AspectRatio>
          </div>
          <Input {...attrs} bind:value={$formData.photo} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col mt-4 space-y-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <form.label>Name</form.label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col my-4 space-y-4">
      <Form.Field {form} name="description">
        <Form.Control let:attrs>
          <form.label>Description</form.label>
          <Textarea
            class=" min-h-32"
            {...attrs}
            bind:value={$formData.description}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>

    <div class={cn("flex-col space-y-4 mt-4")}>
      <Form.Button class="w-full">
        {#if $formData.name}
          Update
        {:else}
          Create
        {/if}
      </Form.Button>
    </div>
  </form>
</ScrollArea>
