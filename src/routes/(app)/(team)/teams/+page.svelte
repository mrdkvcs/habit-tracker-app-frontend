<script lang="ts">
	import type { PageData } from './$types';
	interface Form {
		error?: string;
	}
	interface Props {
		data: PageData;
		form: Form;
	}

	let { data, form }: Props = $props();
	const { userTeams } = data;
</script>

{#if form}
	{#if form.error}
		<p class="text-red-500">{form.error}</p>
	{/if}
{/if}
<div class="flex flex-col gap-3 mt-10 p-8">
	<h1 class="text-xl font-bold">Your teams :</h1>
	{#if userTeams?.length === 0}
		<h2 class="text-gray-500 text-sm text-center">You currently don't belong to any team</h2>
	{:else}
		{#each userTeams as userTeam}
			<div class="flex gap-2 items-center">
				<a href={`/team/${userTeam.id}`}>
					<h2 class="text-lg text-blue-500">{userTeam.team_name}</h2>
				</a>
				{#if userTeam.is_owner === 1}
					<p class="text-gray-500 text-sm">Your the owner of this team</p>
				{/if}
			</div>
		{/each}
	{/if}
</div>
