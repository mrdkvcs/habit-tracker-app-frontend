<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	interface Form {
		error: string;
	}
	let formattedDate = $state(' ');
	interface Props {
		data: any;
		form: Form;
	}

	let { data, form }: Props = $props();
	const { team, user, ownership } = data;
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
	{#if ownership}
		<h2 class="text-lg font-bold mb-2">Owner actions:</h2>
		<div class="flex flex-col gap-2 mb-5">
			<a class="text-blue-500" href={`/team/${team.id}/activities/edit`}
				>Edit your team's activity list</a
			>
			<a class="text-blue-500" href={`/team/${team.id}/roles`}>Edit your team's roles</a>
			<a class="text-blue-500" href={`/team/${team.id}/invite`}>Invite members</a>
			<a class="text-blue-500" href={`/team/${team.id}/members`}>Manage members</a>
		</div>
	{/if}
	<h2 class="text-lg font-bold mt-2 mb-2">Team actions:</h2>
	<div class="flex flex-col gap-2">
		<a class="text-blue-500" href={`/team/${team.id}/activities`}>Your team's activity list</a>
		<a class="text-blue-500" href={`/team/${team.id}/activities/create`}>Set a team activity</a>
	</div>
</Card.Content>
<Card.Footer class="flex justify-between"></Card.Footer>
