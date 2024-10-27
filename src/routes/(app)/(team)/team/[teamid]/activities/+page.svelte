<script lang="ts">
	interface UserTeamActivity {
		id: string;
		team_id: string;
		activity_name: string;
		points: number;
		created_at: string;
		updated_at: string;
	}
	interface PageData {
		userTeamActivities: UserTeamActivity[];
	}
	interface Form {
		error: string;
	}
	interface Props {
		data: PageData;
		form: Form;
	}

	let { data, form }: Props = $props();
	const { userTeamActivities } = data;
</script>

<h1 class="text-xl font-bold text-center">My team's activity list</h1>
{#if form}
	{#if form.error}
		<p class="text-red-500 font-bold">{form.error}</p>
	{/if}
{/if}
{#if userTeamActivities?.length === 0}
	<p class="text-center text-gray-500 mt-5">
		There are currently no activities in the team associated by your role
	</p>
{/if}
{#each userTeamActivities as userTeamActivity}
	<div class="flex gap-2 mt-5 mx-5">
		<h2 class="text-blue-500 font-bold">{userTeamActivity.activity_name}</h2>
		<p class="text-green-500 font-bold">{userTeamActivity.points}</p>
	</div>
{/each}
