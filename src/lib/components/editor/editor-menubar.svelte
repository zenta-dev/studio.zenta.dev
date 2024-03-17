<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { cn } from "@//utils.js";
  import { Editor } from "@tiptap/core";
  import Button from "../ui/button/button.svelte";
  import { Input } from "../ui/input";
  import { Label } from "../ui/label";

  export let editor: Editor;
  export let className: string | undefined = undefined;
  let ytUrl = "";
  const addYoutubeVideo = (url: string) => {
    console.log(url);
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, Math.min(1920, 640)),
        height: Math.max(180, Math.min(1080, 360)),
      });
    }
  };
</script>

<div class={cn("flex gap-2", className)}>
  <Button
    on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
  >
    H1
  </Button>
  <Button
    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
  >
    H2
  </Button>
  <Button
    on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
    variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
  >
    H3
  </Button>
  <Button
    on:click={() => editor.chain().focus().setParagraph().run()}
    variant={editor.isActive("paragraph") ? "default" : "ghost"}
  >
    <iconify-icon icon="material-symbols:format-paragraph-rounded" />
  </Button>
  <Button
    on:click={() => editor.chain().focus().setBlockquote().run()}
    variant={editor.isActive("blockqoute") ? "default" : "ghost"}
  >
    <iconify-icon icon="material-symbols:format-quote-outline-rounded" />
  </Button>
  <Button
    on:click={() =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()}
    variant={editor.isActive("table") ? "default" : "ghost"}
  >
    <iconify-icon icon="mdi:table-large" />
  </Button>

  <Button
    on:click={() => editor.chain().focus().toggleTaskList().run()}
    variant={editor.isActive("tasklist") ? "default" : "ghost"}
  >
    <iconify-icon icon="octicon:tasklist-16" />
  </Button>
  <Button
    on:click={() => editor.chain().focus().toggleCodeBlock().run()}
    variant={editor.isActive("codeBlock") ? "default" : "ghost"}
  >
    <iconify-icon icon="material-symbols:code-rounded" />
  </Button>
  <Button
    on:click={() => editor.chain().focus().setHorizontalRule().run()}
    variant={editor.isActive("horizontalRule") ? "default" : "ghost"}
  >
    <iconify-icon icon="octicon:horizontal-rule" />
  </Button>
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild let:builder>
      <Button builders={[builder]} variant="ghost">
        <iconify-icon icon="material-symbols:youtube-activity" />
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Add related Youtube URL</AlertDialog.Title>
        <AlertDialog.Description>
          Provide valid youtube URL to add video
        </AlertDialog.Description>
      </AlertDialog.Header>
      <Label for="yt-link">Youtube URL</Label>
      <Input id="yt-link" on:input={(e) => (ytUrl = e.target?.value)} />

      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action on:click={() => addYoutubeVideo(ytUrl)}
          >Add</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
