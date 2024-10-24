<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
</script>

<Card.Root class="w-[750px]  mx-auto ">
	<button on:click={() => window.history.back()} class="bg-white text-black">
		<Icon icon="bi:arrow-left" width="40" class="m-5" />
	</button>
	<slot />
	<Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
