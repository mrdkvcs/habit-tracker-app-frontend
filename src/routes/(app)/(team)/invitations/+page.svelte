<script lang="ts">
	interface Form {
		error: string;
		success: string;
	}
	interface Props {
		data: any;
		form: Form;
	}

	let { data, form }: Props = $props();
	const { teamInvites } = data;
</script>

{#if form}
	{#if form.error}
		<p class="text-red-500 text-center">{form.error}</p>
	{/if}
	{#if form.success}
		<p class="text-green-500 text-center mb-4">
			{form.success}, check out your teams at the <a class="text-blue-500" href="/teams">Teams</a> section
		</p>
	{/if}
{/if}
<h2 class="font-bold text-xl ml-4">Your team invites:</h2>
{#if teamInvites.length === 0}
	<p class="text-center text-gray-500">You currently dont have any team invites</p>
{/if}
{#each teamInvites as teamInvite}
	<div class="flex items-center mb-4 gap-4 mt-4 ml-4">
		<h2 class="font-bold text-lg text-blue-500">{teamInvite.team_name}</h2>
		<p>
			industry : {teamInvite.team_industry.charAt(0).toUpperCase() +
				teamInvite.team_industry.slice(1)}
		</p>
		<p>size : {teamInvite.team_size}</p>
		<form method="POST" action="?/acceptInvite">
			<input type="hidden" name="teamId" value={teamInvite.team_id} />
			<input type="hidden" name="inviteId" value={teamInvite.invitation_id} />
			<button type="submit">
				<p class="text-green-500">Accept</p>
			</button>
		</form>
		<form method="POST" action="?/declineInvite">
			<button type="submit">
				<input type="hidden" name="inviteId" value={teamInvite.invitation_id} />
				<p class="text-red-500">Decline</p>
			</button>
		</form>
	</div>
{/each}
