<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class=" text-lg">
	<SvelteToast />
</div>

{@render children?.()}
