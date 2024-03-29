<script lang="ts">
  import { PUBLIC_CLODINARY_UPLOAD_PRESET } from "$env/static/public";
  import Combobox from "@//components/combobox.svelte";
  import Editor from "@//components/editor/editor.svelte";
  import { Button } from "@//components/ui/button";
  import * as Form from "@//components/ui/form";
  import { Input } from "@//components/ui/input";
  import { ScrollArea } from "@//components/ui/scroll-area";
  import type { ComboboxInterface } from "@//constants";
  import { cn } from "@//utils.js";
  import { CldImage, CldUploadWidget } from "svelte-cloudinary";
  import { toast } from "svelte-sonner";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { type PostFormSchema } from "./schema";

  export let users: ComboboxInterface[];
  export let data: SuperValidated<Infer<PostFormSchema>>;
  export let tags: ComboboxInterface[];
  export let stacks: ComboboxInterface[];
  let isLoading: boolean = false;
  const form = superForm(data, {
    dataType: "json",
    onSubmit() {
      isLoading = true;
    },
    onError({ result }) {
      isLoading = false;
      console.log("PostForm onError", result.error);
      if (!result.error) return;

      return toast.error(result.error.message, {
        description: result.error.description,
        duration: 5000,
      });
    },
    onResult({ result }) {
      isLoading = false;
      console.log("PostForm onResult", result);
      if (result.type === "success") {
        toast.success(result.data?.form.message.message, {
          description: result.data?.form.message.description,
          duration: 5000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    },
  });
  const { form: formData, errors, enhance } = form;

  function onUpload(result: any, widget: any) {
    console.log(result);
    if (result.event === "success") {
      console.log(result.info.secure_url);
      $formData.cover = result.info.secure_url;
      toast.success("Image uploaded successfully");
    } else if (result.event === "error") {
      toast.error("Failed to upload image");
    }
    widget.close();
  }
</script>

<ScrollArea class="w-full">
  <form
    method="post"
    use:enhance
    class={cn("w-full p-8 ")}
    action={$formData.id ? "?/update" : "?/create"}
  >
    <div class="flex flex-col mt-4 space-y-4">
      <Form.Field {form} name="title">
        <Form.Control let:attrs>
          <Form.Label>Title</Form.Label>
          <Input {...attrs} bind:value={$formData.title} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex flex-col my-4 space-y-4">
      <Form.Field {form} name="slug">
        <Form.Control let:attrs>
          <form.label>Slug</form.label>
          <Input {...attrs} bind:value={$formData.slug} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid mt-4 space-y-4">
      <Form.Field {form} name="cover">
        <Form.Control let:attrs>
          <Form.Label>Cover</Form.Label>
          {#if $formData.cover}
            <CldImage
              src={$formData.cover}
              alt="cover"
              width="1280px"
              height="360"
              crop="fill"
              class=" h-[calc(22rem)] w-[calc(80rem)] rounded-xl"
              gravity="center"
            />
          {/if}
          <CldUploadWidget
            {...attrs}
            bind:value={$formData.cover}
            uploadPreset={PUBLIC_CLODINARY_UPLOAD_PRESET}
            let:open
            options={{
              sources: ["local", "url", "unsplash"],
              multiple: false,
              maxFiles: 1,
            }}
            signatureEndpoint="/api/upload"
            {onUpload}
            style="background: none;"
          >
            <div class="flex items-center justify-center w-full">
              <button class="" on:click={open}>
                <div class="p-8 border rounded-lg">
                  <div class="flex items-center justify-center w-full h-full">
                    <iconify-icon class="text-3xl" icon="ph:plus" />
                  </div>
                </div>
              </button>
            </div>
          </CldUploadWidget>
        </Form.Control>
        {#if $errors.cover}
          <Form.FieldErrors>
            <span class="invalid">{$errors.cover}</span>
          </Form.FieldErrors>
        {/if}
      </Form.Field>
    </div>
    <p
      class={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[fs-error]:text-destructive mt-4"}
    >
      Authors
    </p>
    <div class="p-2 my-4 border rounded-lg">
      <div class="grid grid-cols-4 gap-4">
        {#each $formData.authors as author, i}
          <div class="p-4 border rounded-lg">
            <Form.Field {form} name={`authors[${i}]`}>
              <Combobox
                bind:value={author.id}
                name="author"
                data={users}
                lastValue={$formData.authors[i].id}
                index={i}
                isForm={true}
                formValue={$formData.authors[i]}
              />
              {#if $errors.authors?.[i]?.id}
                <Form.FieldErrors>
                  <span class="invalid">{$errors.authors[i].id}</span>
                </Form.FieldErrors>
              {/if}
            </Form.Field>
          </div>
          {#if i === $formData.authors.length - 1}
            <div class="p-4 mt-4 border rounded-lg">
              <div class="flex items-center justify-center w-full h-full">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="add"
                  on:click={() => {
                    if ($formData.authors[i].id === "") {
                      toast.error("Please fill the previous author");
                      return;
                    }

                    $formData.authors = [...$formData.authors, { id: "" }];
                  }}
                >
                  <iconify-icon icon="ph:plus" />
                </Button>
              </div>
            </div>
          {/if}
        {/each}
        {#if $formData.authors.length === 0}
          <div class="p-4 border rounded-lg">
            <div class="flex items-center justify-center w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                aria-label="add"
                on:click={() => {
                  $formData.authors = [...$formData.authors, { id: "" }];
                }}
              >
                <iconify-icon icon="ph:plus" />
              </Button>
            </div>
          </div>
        {/if}
      </div>
      {#if $errors.authors?._errors}
        <span class="invalid text-[0.8rem] font-medium text-destructive"
          >{$errors.authors._errors}</span
        >
      {/if}
    </div>

    <p
      class={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[fs-error]:text-destructive"}
    >
      Tags
    </p>
    <div class="p-2 my-4 border rounded-lg">
      <div class="grid grid-cols-4 gap-4">
        {#each $formData.tags as tag, i}
          <div class="p-4 border rounded-lg">
            <Form.Field {form} name={`tags[${i}]`}>
              <Combobox
                bind:value={tag.id}
                name="tag"
                data={tags}
                lastValue={$formData.tags[i].id}
                index={i}
                isForm={true}
                formValue={$formData.tags[i]}
              />
              {#if $errors.tags?.[i]?.id}
                <Form.FieldErrors>
                  <span class="invalid">{$errors.tags[i].id}</span>
                </Form.FieldErrors>
              {/if}
            </Form.Field>
          </div>
          {#if i === $formData.tags.length - 1}
            <div class="p-4 mt-4 border rounded-lg">
              <div class="flex items-center justify-center w-full h-full">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="add"
                  on:click={() => {
                    if ($formData.tags[i].id === "") {
                      toast.error("Please fill the previous tag");
                      return;
                    }

                    $formData.tags = [...$formData.tags, { id: "" }];
                  }}
                >
                  <iconify-icon icon="ph:plus" />
                </Button>
              </div>
            </div>
          {/if}
        {/each}
        {#if $formData.tags.length === 0}
          <div class="p-4 border rounded-lg">
            <div class="flex items-center justify-center w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                aria-label="add"
                on:click={() => {
                  $formData.tags = [...$formData.tags, { id: "" }];
                }}
              >
                <iconify-icon icon="ph:plus" />
              </Button>
            </div>
          </div>
        {/if}
      </div>
      {#if $errors.tags?._errors}
        <span class="invalid text-[0.8rem] font-medium text-destructive"
          >{$errors.tags._errors}</span
        >
      {/if}
    </div>
    <p
      class={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[fs-error]:text-destructive"}
    >
      Stacks
    </p>
    <div class="p-2 my-4 border rounded-lg">
      <div class="grid grid-cols-4 gap-4">
        {#each $formData.stacks as stack, i}
          <div class="p-4 border rounded-lg">
            <Form.Field {form} name={`stacks[${i}]`}>
              <Combobox
                bind:value={stack.id}
                name="stack"
                data={stacks}
                lastValue={$formData.stacks[i].id}
                index={i}
                isForm={true}
                formValue={$formData.stacks[i]}
              />
              {#if $errors.stacks?.[i]?.id}
                <Form.FieldErrors>
                  <span class="invalid">{$errors.stacks[i].id}</span>
                </Form.FieldErrors>
              {/if}
            </Form.Field>
          </div>
          {#if i === $formData.stacks.length - 1}
            <div class="p-4 mt-4 border rounded-lg">
              <div class="flex items-center justify-center w-full h-full">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="add"
                  on:click={() => {
                    if ($formData.stacks[i].id === "") {
                      toast.error("Please fill the previous stack");
                      return;
                    }

                    $formData.stacks = [...$formData.stacks, { id: "" }];
                  }}
                >
                  <iconify-icon icon="ph:plus" />
                </Button>
              </div>
            </div>
          {/if}
        {/each}
        {#if $formData.stacks.length === 0}
          <div class="p-4 border rounded-lg">
            <div class="flex items-center justify-center w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                aria-label="add"
                on:click={() => {
                  $formData.stacks = [...$formData.stacks, { id: "" }];
                }}
              >
                <iconify-icon icon="ph:plus" />
              </Button>
            </div>
          </div>
        {/if}
      </div>
      {#if $errors.stacks?._errors}
        <span class="invalid text-[0.8rem] font-medium text-destructive"
          >{$errors.stacks._errors}</span
        >
      {/if}
    </div>

    <Form.Field {form} name="content">
      <Form.Control let:attrs>
        <form.label>Content</form.label>
        <div
          class="flex flex-col p-2 mx-auto mt-4 space-y-4 border rounded-lg max-h-fit"
        >
          <Editor {...attrs} bind:value={$formData.content} />

          {#if $errors.content}
            <Form.FieldErrors>
              <span class="invalid">{$errors.content}</span>
            </Form.FieldErrors>
          {/if}
        </div>
      </Form.Control>
    </Form.Field>
    <Form.Button class="w-full gap-4" disabled={isLoading}>
      {#if isLoading}
        <iconify-icon
          icon="line-md:loading-twotone-loop"
          class="text-3xl animate-spin"
        />
      {/if}
      {#if $formData.id}
        Update
      {:else}
        Create
      {/if}
    </Form.Button>
  </form>
</ScrollArea>
