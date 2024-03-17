<script lang="ts">
  export let url: string;

  async function getUrlData() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
</script>

<div class="container flex items-center gap-2"></div>
