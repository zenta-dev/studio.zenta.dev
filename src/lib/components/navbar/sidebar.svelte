<script>
	import { Document, Home, Tag, Tech } from '@//assets/icons';
	import { SidebarItem } from '.';
</script>

<aside
	class="fixed bottom-0 left-0 right-0 z-50 flex justify-between p-1 m-4 rounded-xl bg-primary/5"
>
	<SidebarItem href="/" class="justify-center w-1/4">
		<Home class="text-2xl" />
		Home
	</SidebarItem>
	<SidebarItem href="/tag" class="justify-center w-1/4">
		<Tag class="text-2xl" />
		Tag
	</SidebarItem>
	<SidebarItem href="/tech" class="justify-center w-1/4">
		<Tech class="text-2xl" />
		Tech
	</SidebarItem>
	<SidebarItem href="/post" class="justify-center w-1/4">
		<Document class="text-2xl" />
		Post
	</SidebarItem>
</aside>
