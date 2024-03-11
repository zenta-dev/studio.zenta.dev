<script lang="ts">
  import Header from "@//components/Header.svelte";
  import Button from "@//components/ui/button/button.svelte";
  import type { PageData } from "./$types.js";
  import SigininForm from "./signin-form.svelte";

  export let data: PageData;
</script>

<div class="flex flex-col h-full">
  <Header>
    <a href="/signup"> <Button>Sign Up</Button> </a>
  </Header>
  <SigininForm data={data.form} className="m-auto " />
</div>
