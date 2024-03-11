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
  import { signInSchema, type SignInSchema } from "./schema";

  export let data: SuperValidated<Infer<SignInSchema>>;
  export let className: string | undefined = undefined;

  const form = superForm(data, {
    validators: zodClient(signInSchema),
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

<Card.Root class={cn(className)}>
  <Card.Header class={cn("my-2")}>
    <Card.Title class={cn("text-2xl")}>Sign In</Card.Title>
    <Card.Description>
      Please sign up for accessing studio dashboard
    </Card.Description>
  </Card.Header>
  <Separator />
  <form method="post" use:enhance>
    <Card.Content class="flex flex-col mt-4 space-y-4">
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
    </Card.Content>
    <Card.Footer class={cn("flex-col space-y-4")}>
      <Form.Button class="w-full">Sign In</Form.Button>
      <a href="/signup">
        Don't have an account?
        <span class={cn("text-blue-500")}>Sign Up</span>
      </a>
    </Card.Footer>
  </form>
</Card.Root>
