<script lang="ts">
  import logo from "$lib/assets/logo.svg";
  import SidebarItem from "@//components/SidebarItem.svelte";
  import { Separator } from "@//components/ui/separator";
</script>

<div class="flex">
  <div class="border-r-2 min-w-[calc(17rem)]">
    <a href="/" class="flex items-center justify-center py-4">
      <div class="flex text-2xl">
        <img src={logo} alt="logo" class="w-8 h-8" />
        <h1 class="flex ml-4 font-bold">
          studio
          <span class="hidden font-normal sm:block">.zenta.dev</span>
        </h1>
      </div>
    </a>
    <Separator />
    <div class="items-center p-4 space-y-4">
      <SidebarItem href="/tech" className="justify-center">
        <iconify-icon icon="ph:codesandbox-logo-thin" />
        Tech
      </SidebarItem>
      <SidebarItem href="/tag" className="justify-center">
        <iconify-icon icon="ph:tag-light" />
        Tag
      </SidebarItem>
      <SidebarItem href="/post" className="justify-center">
        <iconify-icon icon="arcticons:documents" />
        Post
      </SidebarItem>
      <Separator />
      <!-- <h1 class="text-xl font-semibold text-center">User</h1> -->
      <!-- <SidebarItem href="/invite" className="justify-center">
        <iconify-icon icon="mingcute:invite-line" />
        Invite
      </SidebarItem>
      <SidebarItem href="/user" className="justify-center">
        <iconify-icon icon="ph:user-circle-light" />
        User
      </SidebarItem> -->
      <form method="POST">
        <SidebarItem
          isButton={true}
          className="justify-center p-1"
          formaction="/logout"
          type="submit"
        >
          <iconify-icon icon="ic:round-logout" />
          Logout
        </SidebarItem>
      </form>
    </div>
  </div>

  <slot />
</div>
