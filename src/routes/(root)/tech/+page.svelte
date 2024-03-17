<script lang="ts">
  import { PUBLIC_DOMAIN, PUBLIC_NAME } from "$env/static/public";
  import SidebarItem from "@//components/SidebarItem.svelte";
  import Button from "@//components/ui/button/button.svelte";
  import ScrollArea from "@//components/ui/scroll-area/scroll-area.svelte";
  import { Separator } from "@//components/ui/separator";
  import SvelteSeo from "@//svelte-seo";
  import { Image } from "@unpic/svelte";
  import { superValidate } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import { techFormSchema } from "./(components)/schema";
  import TechForm from "./(components)/tech-form.svelte";

  export let data: PageData;

  let selectedTech = data.tech[0];

  async function generateForm(data: any) {
    return await superValidate(data, zod(techFormSchema));
  }
</script>

<div class="flex justify-between">
  <section class="border-r-2 text-start">
    <div class="flex items-center justify-between m-4 min-w-32">
      <a href="/" class="flex">
        <div class="flex text-2xl">
          <h1 class="ml-4 font-semibold">/</h1>
          <h1 class="hidden sm:block">tech</h1>
        </div>
      </a>
      <iconify-icon icon="akar-icons:plus" />
    </div>
    <Separator />
    <ScrollArea class=" h-[calc(100vh-74px)]">
      {#each Object.entries(data.tech) as [_, value], i}
        <SidebarItem
          isButton={true}
          buttonActive={value.id == selectedTech.id}
          onClick={() => {
            selectedTech = value;
          }}
          className="p-2 m-4 min-w-80"
        >
          <div class="flex items-center px-4 py-2">
            <Image
              src={value.logo}
              layout="constrained"
              width={24}
              height={24}
              alt={value.name}
            />
            <div class="ml-4 text-start">
              <h1 class="text-xl font-semibold">
                {value.name}
              </h1>

              <p class="text-xs text-neutral-500">
                {#if value.updatedAt}
                  <span class="text-neutral-400">Updated:</span>
                  {new Date(value.updatedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                {:else}
                  <span class="text-neutral-400">Created:</span>
                  {new Date(value.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                {/if}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="sm" aria-label="edit" slot="action">
            <iconify-icon icon="ph:dots-three-vertical-bold" />
          </Button>
        </SidebarItem>
      {/each}
    </ScrollArea>
  </section>
</div>

<div class="flex flex-col items-center justify-center w-full h-screen">
  {#await generateForm(selectedTech)}
    <div class="flex items-center justify-center w-full h-full">
      <div
        class="w-32 h-32 border-t-2 border-b-2 rounded-full animate-spin border-primary-500"
      />
    </div>
  {:then form}
    <TechForm data={form} />
  {:catch error}
    <p>{error.message}</p>
  {/await}
</div>

<SvelteSeo
  title={`Tech | ${PUBLIC_NAME}`}
  description="Tech Management for Zenta Studio"
  canonical={`${PUBLIC_DOMAIN}/tech`}
  keywords="tech, zenta studio, seo, tag, post, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
  openGraph={{
    title: `Tech | ${PUBLIC_NAME}`,
    description: "Tech Management for Zenta Studio",
    url: `${PUBLIC_DOMAIN}/tech`,
    type: "website",
    site_name: `${PUBLIC_NAME}`,
  }}
  twitter={{
    card: "summary_large_image",
    site: "@zenta_studio",
    creator: "@zenta_studio",
    title: `Tech | ${PUBLIC_NAME}`,
    description: "Tech Management for Zenta Studio",
  }}
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${PUBLIC_DOMAIN}/tech`,
    name: `${PUBLIC_NAME}`,
    description: "Tech Management for Zenta Studio",
  }}
/>
