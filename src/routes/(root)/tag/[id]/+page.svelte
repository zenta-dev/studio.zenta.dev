<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="max-w-1/2">
  <h1>Tag page {data.tag?.name}</h1>
</div>
