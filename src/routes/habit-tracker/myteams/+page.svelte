<script lang="ts">
	import type { PageData } from './$types';
	interface Form {
		error?: string;
	}
	export let data: PageData;
	export let form: Form;
	const { userTeams } = data;
</script>

{#if form}
	{#if form.error}
		<p class="text-red-500">{form.error}</p>
	{/if}
{/if}
<div class="flex flex-col gap-3 mt-10">
	<h1 class="text-xl font-bold">Your teams :</h1>
	{#each userTeams as userTeam}
		<div class="flex gap-2 items-center">
			<h2 class="text-lg text-blue-500">{userTeam.team_name}</h2>
			{#if userTeam.role === 'owner'}
				<p class="text-gray-500 text-sm">Your the owner of this team</p>
			{/if}
		</div>
	{/each}
</div>
