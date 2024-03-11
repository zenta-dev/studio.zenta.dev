<script>
  import { Toaster } from "$lib/components/ui/sonner";
  import "iconify-icon";
  import { ModeWatcher } from "mode-watcher";
  import "../app.pcss";
</script>

<svelte:head>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
  </style>
</svelte:head>

<Toaster />
<ModeWatcher />
<div class="w-screen h-screen">
  <slot />
</div>
