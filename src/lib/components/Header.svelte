<script lang="ts">
  import logo from "$lib/assets/logo.svg";
</script>

<div class="container flex justify-between mx-auto my-4 max-w-7xl">
  <a href="/">
    <div class="flex text-2xl">
      <img src={logo} alt="logo" class="w-8 h-8" />
      <h1 class="ml-4 font-semibold">studio</h1>
      <h1 class="hidden sm:block">.zenta.dev</h1>
    </div>
  </a>
  <div class="flex items-center">
    <slot />
  </div>
</div>
