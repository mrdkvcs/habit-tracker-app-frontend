<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	let formattedDate = '';
	export let data;
	const { user, activityPoints } = data;
	onMount(() => {
		const date = new Date();
		formattedDate = date
			.toLocaleDateString('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
			.replace(/\//g, ' ');
	});
</script>

<div class="flex flex-col gap-5 items-center">
	<h1 class="text-4xl font-bold">The Ultimate Habit Tracker</h1>
	<p class="text-sm italic text-gray-500">The app you need to enhance your productivity</p>
</div>

<form method="POST" class="flex gap-3 absolute top-10 right-0" action="?/signout">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
	</Avatar.Root>
	<Button type="submit" class="bg-blue-500 p-5 mr-5">Sign out</Button>
</form>

<Card.Root class="w-[750px] ] mx-auto mt-20">
	<a href="/habit-tracker/dashboard">
		<Icon icon="bi:arrow-left" width="40" class="m-5" />
	</a>
	<Card.Header class="flex flex-col gap-4">
		<h1 class="text-2xl font-bold text-center">Hey welcome , {user.username}</h1>
		<h2 class="text-xl">Day today : {formattedDate}</h2>
		<p class="text-sm text-gray-500">Total productivity points for today: {activityPoints}</p>
	</Card.Header>
	<Card.Content>
		<slot />
	</Card.Content>
	<Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
