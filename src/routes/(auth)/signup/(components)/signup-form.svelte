<script lang="ts">
  import { goto } from "$app/navigation";
  import { cn } from "$lib/utils.js.js";
  import * as Card from "@//components/ui/card";
  import * as Form from "@//components/ui/form";
  import { Input } from "@//components/ui/input";
  import { Separator } from "@//components/ui/separator";
  import { toast } from "svelte-sonner";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { signUpSchema, type SignUpSchema } from "./schema";

  export let data: SuperValidated<Infer<SignUpSchema>>;
  export let className: string | undefined = undefined;
  let isLoading: boolean = false;

  const form = superForm(data, {
    validators: zodClient(signUpSchema),
    onSubmit() {
      isLoading = true;
    },
    onError({ result }) {
      isLoading = false;
      if (!result.error) return;

      return toast.error(result.error.message, {
        description: result.error.description,
        duration: 5000,
      });
    },
    onResult({ result }) {
      isLoading = false;
      if (result.type === "success") {
        toast.success(result.data?.form.message.message, {
          description: result.data?.form.message.description,
          duration: 5000,
        });
        goto("/signin");
      } else {
        toast.error("Internal server error", {
          description: "Please try again later",
          duration: 5000,
        });
      }
    },
  });

  const { form: formData, enhance } = form;
</script>

<Card.Root class={cn(className)}>
  <Card.Header class={cn("my-2")}>
    <Card.Title class={cn("text-2xl")}>Sign Up</Card.Title>
    <Card.Description>
      Please provide your details to sign up for studio dashboard
    </Card.Description>
  </Card.Header>
  <Separator />
  <form method="post" use:enhance>
    <Card.Content class="flex flex-col mt-4 space-y-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <form.label>Name</form.label>
          <Input {...attrs} bind:value={$formData.name} type="text" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <form.label>Email</form.label>
          <Input {...attrs} bind:value={$formData.email} type="email" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <form.label>Password</form.label>
          <Input {...attrs} bind:value={$formData.password} type="password" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="confirmPassword">
        <Form.Control let:attrs>
          <form.label>Confirm Password</form.label>
          <Input
            {...attrs}
            bind:value={$formData.confirmPassword}
            type="password"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="pin">
        <Form.Control let:attrs>
          <form.label>Invitation PIN</form.label>
          <Input {...attrs} bind:value={$formData.pin} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Card.Content>
    <Card.Footer class={cn("flex-col space-y-4")}>
      <Form.Button class="w-full" disabled={isLoading}>
        {#if isLoading}
          <iconify-icon
            icon="line-md:loading-twotone-loop"
            class="animate-spin"
          />
        {:else}
          Sign Up
        {/if}
      </Form.Button>
      <a href="/signin">
        Already have an account?
        <span class={cn("text-blue-500")}>Sign In</span>
      </a>
    </Card.Footer>
  </form>
</Card.Root>
