<script lang="ts">
	import { Sonner } from '@//components/sooner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<slot />
<ModeWatcher />
<Sonner richColors closeButton />
