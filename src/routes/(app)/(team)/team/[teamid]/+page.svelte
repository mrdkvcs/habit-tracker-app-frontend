<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	interface Form {
		error: string;
	}
	export let data;
	let formattedDate = ' ';
	export let form: Form;
	const { team, user } = data;
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

{#if form}
	{#if form.error}
		<p class="text-red-500">{form.error}></p>
	{/if}
{/if}
<Card.Header class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold text-center">Welcome to {team.team_name}, {user.username}</h1>
	<h2 class="text-xl">Today : {formattedDate}</h2>
</Card.Header>
<Card.Content>
	{#if team.created_by === user.id}
		<div class="flex flex-col gap-2">
			<h2 class="text-lg font-bold">Owner actions:</h2>
			<a class="text-blue-500" href={`/team/${team.id}/activities`}
				>Edit your team's activity list</a
			>
		</div>
	{/if}
</Card.Content>
<Card.Footer class="flex justify-between"></Card.Footer>
