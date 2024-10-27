<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Card.Root class="w-[750px]  mx-auto ">
	<button onclick={() => window.history.back()} class="bg-white text-black">
		<Icon icon="bi:arrow-left" width="40" class="m-5" />
	</button>
	{@render children?.()}
	<Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
