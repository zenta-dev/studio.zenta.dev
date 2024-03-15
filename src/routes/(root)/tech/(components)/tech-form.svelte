<script lang="ts">
  import { goto } from "$app/navigation";
  import { cn } from "$lib/utils.js.js";
  import Combobox from "@//components/combobox.svelte";
  import AspectRatio from "@//components/ui/aspect-ratio/aspect-ratio.svelte";
  import Button from "@//components/ui/button/button.svelte";
  import * as Form from "@//components/ui/form";
  import { Input } from "@//components/ui/input";
  import ScrollArea from "@//components/ui/scroll-area/scroll-area.svelte";
  import Textarea from "@//components/ui/textarea/textarea.svelte";
  import UrlContainer from "@//components/url-container.svelte";
  import { toast } from "svelte-sonner";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { type TechFormSchema } from "./schema";

  export let data: SuperValidated<Infer<TechFormSchema>>;

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
          <Textarea {...attrs} bind:value={$formData.description} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <form.label>Logo</form.label>
    <div class="flex flex-col p-4 mt-4 space-y-4 border rounded-lg">
      <Form.Field {form} name="logo">
        <Form.Control let:attrs>
          <div class="container items-center w-64">
            <AspectRatio ratio={1 / 1}>
              <img
                src={$formData.logo}
                alt="Gray by Drew Beamer"
                class="object-cover w-full h-full rounded-md"
              />
            </AspectRatio>
          </div>
          <Input {...attrs} bind:value={$formData.logo} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col mt-4 space-y-4">
      <Form.Field {form} name="url">
        <Form.Control let:attrs>
          <form.label>Defintion Url</form.label>
          <Input {...attrs} bind:value={$formData.url} />
          <UrlContainer url={$formData.url}>as</UrlContainer>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col mt-4 space-y-4">
      <Form.Field {form} name="homepage">
        <Form.Control let:attrs>
          <form.label>Home page</form.label>
          <Input {...attrs} bind:value={$formData.homepage} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col mt-4 space-y-4">
      <Form.Field {form} name={"founder.name"}>
        <Form.Control let:attrs>
          <form.label>Founder name</form.label>
          <Input {...attrs} bind:value={$formData.founder.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col mt-4 space-y-4">
      <Form.Field {form} name={"founder.type"}>
        <Form.Control let:attrs>
          <form.label>Founder Type</form.label>
          <Combobox bind:value={$formData.founder.type} name={"type"} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col my-4 space-y-4">
      <Form.Field {form} name={"founder.url"}>
        <Form.Control let:attrs>
          <form.label>Founder Biodata Url</form.label>
          <Input {...attrs} bind:value={$formData.founder.url} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <form.label>Founder Photo</form.label>
    <div class="flex flex-col p-4 my-4 space-y-4 border rounded-lg">
      <Form.Field {form} name={"founder.photo"}>
        <Form.Control let:attrs>
          <div class="container items-center w-64">
            <AspectRatio ratio={1 / 1}>
              <img
                src={$formData.founder.photo}
                alt="Gray by Drew Beamer"
                class="object-cover w-full h-full rounded-md"
              />
            </AspectRatio>
          </div>
          <Input {...attrs} bind:value={$formData.founder.photo} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <form.label>Tech Version</form.label>
    <div class="grid grid-cols-2 gap-4 px-4 py-2 mt-4 border rounded-lg">
      {#each $formData.versions as version, i}
        <div class="p-4 mt-4 border rounded-lg">
          <div>
            <Form.Field {form} name={`versions[${i}].version`}>
              <Form.Control let:attrs>
                <form.label>Version</form.label>
                <Input {...attrs} bind:value={version.version} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="mt-4">
            <Form.Field {form} name={`versions[${i}].description`}>
              <Form.Control let:attrs>
                <form.label>Description</form.label>
                <Textarea {...attrs} bind:value={version.description} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="mt-4">
            <Form.Field {form} name={`versions[${i}].whatNews`}>
              <Form.Control let:attrs>
                <form.label>What news</form.label>
                <Textarea
                  class="min-h-48"
                  {...attrs}
                  bind:value={version.whatNews}
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="mt-4">
            <Form.Field {form} name={`versions[${i}].url`}>
              <Form.Control let:attrs>
                <form.label>Url</form.label>
                <Input {...attrs} bind:value={version.url} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
        </div>
        {#if i === $formData.versions.length - 1}
          <div class="p-4 mt-4 border rounded-lg">
            <div class="flex items-center justify-center w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                aria-label="add"
                on:click={() => {
                  $formData.versions = [...$formData.versions, {}];
                }}
              >
                <iconify-icon icon="ph:plus" />
              </Button>
            </div>
          </div>
        {/if}
      {/each}
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
