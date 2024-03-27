<script lang="ts">
  import { PUBLIC_DOMAIN, PUBLIC_NAME } from "$env/static/public";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import SidebarItem from "@//components/SidebarItem.svelte";
  import { Button } from "@//components/ui/button";
  import { ScrollArea } from "@//components/ui/scroll-area";
  import Separator from "@//components/ui/separator/separator.svelte";
  import SvelteSeo from "@//svelte-seo";
  import { Image } from "@unpic/svelte";
  import { toast } from "svelte-sonner";
  import { superValidate } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import PostForm from "./(components)/post-form.svelte";
  import { postFormSchema } from "./(components)/schema";

  export let data: PageData;

  let selectedPost = data.post[0];
  async function generateForm(data: any) {
    return await superValidate(data, zod(postFormSchema));
  }
  function newPost(e: Event) {
    e.preventDefault();
    selectedPost = {
      id: "",
      title: "",
      slug: "",
      published: false,
      cover: null,
      content: {},
      summary: "",
      related: [],
      views: 0,
      readTime: 0,
      createdAt: new Date(),
      updatedAt: null,
      authors: [],
      tags: [],
      stacks: [],
    };
  }

  function deletePost(id: string) {
    return async () => {
      const res = await fetch(`/post/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Post deleted successfully", {
          duration: 5000,
        });
        window.location.reload();
      } else {
        toast.error("Post deletion failed", {
          description: data.message,
          duration: 5000,
        });
      }
    };
  }

  $: {
    if (data.post.length > 0) {
      selectedPost = data.post[0];
    }
  }
</script>

<div class="flex justify-between">
  <section class="border-r-2 text-start">
    <div class="flex items-center justify-between m-4 min-w-32">
      <a href="/" class="flex">
        <div class="flex text-2xl">
          <h1 class="ml-4 font-semibold">/</h1>
          <h1 class="hidden sm:block">post</h1>
        </div>
      </a>
      <Button on:click={newPost} class={"py-1.5 px-4 h-min  "}>
        <iconify-icon icon="akar-icons:plus" />
        Create
      </Button>
    </div>
    <Separator />
    <ScrollArea class=" h-[calc(100vh-74px)]">
      {#each Object.entries(data.post) as [_, value], i}
        <SidebarItem
          isButton={true}
          buttonActive={value.id == selectedPost.id}
          onClick={() => {
            selectedPost = value;
          }}
          className="p-1 m-1 min-w-80 w-min pr-4"
        >
          <div class="flex items-center px-4 py-2">
            <Image
              src={value.cover ?? "https://via.placeholder.com/24"}
              layout="constrained"
              width={24}
              height={24}
              alt={value.title}
            />
            <div class="ml-4 text-start">
              <h1 class="text-xl font-semibold">
                {value.title}
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
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button variant="ghost" aria-label="edit">
                <iconify-icon class="text-red-500" icon="jam:trash" />
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action on:click={deletePost(value.id)}
                  >Continue</AlertDialog.Action
                >
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
          <!-- <Button variant="ghost" size="sm" aria-label="edit" slot="action">
            <iconify-icon icon="ph:dots-three-vertical-bold" />
          </Button> -->
        </SidebarItem>
      {/each}
    </ScrollArea>
  </section>
</div>

<div class="flex flex-col items-center justify-center w-full h-screen">
  {#await generateForm(selectedPost)}
    <div class="flex items-center justify-center w-full h-full">
      <div
        class="w-32 h-32 border-t-2 border-b-2 rounded-full animate-spin border-primary-500"
      />
    </div>
  {:then form}
    <PostForm
      data={form}
      users={data.users}
      stacks={data.stack}
      tags={data.tags}
    />
  {:catch error}
    <p>{error.message}</p>
  {/await}
</div>

<SvelteSeo
  title={`Post | ${PUBLIC_NAME}`}
  description="Create, Edit, and Delete Post with Zenta Studio for Seamless SEO Integration"
  canonical={`${PUBLIC_DOMAIN}/post`}
  keywords="post, zenta studio, seo, tech, tag, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
  openGraph={{
    title: `Post | ${PUBLIC_NAME}`,
    description:
      "Create, Edit, and Delete Post with Zenta Studio for Seamless SEO Integration",
    url: `${PUBLIC_DOMAIN}/post`,
    type: "website",
    site_name: `${PUBLIC_NAME}`,
    images: data.post.map((post) => ({
      url: post.cover || `${PUBLIC_DOMAIN}/favicon.png`,
      alt: post.title || "Post Cover",
    })),
  }}
  twitter={{
    card: "summary_large_image",
    site: "@zenta_studio",
    creator: "@zenta_studio",
    title: `Post | ${PUBLIC_NAME}`,
    description:
      "Create, Edit, and Delete Post with Zenta Studio for Seamless SEO Integration",
  }}
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${PUBLIC_DOMAIN}/post`,
    name: `${PUBLIC_NAME}`,
    description:
      "Create, Edit, and Delete Post with Zenta Studio for Seamless SEO Integration",
  }}
/>
