<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Card.Root class="w-[1050px]  mt-5  mx-auto ">
	{@render children?.()}
	<Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
