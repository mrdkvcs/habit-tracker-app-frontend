<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { PageData } from './$types';
	interface Form {
		error: string;
		success: string;
	}
	export let data: PageData;
	export let form: Form;
	const { teamActivities, teamRoles } = data;
	let selectedTeamRoles: string[] = [];
	function addRole(role: string) {
		selectedTeamRoles = [...selectedTeamRoles, role];
	}
	function removeRole(role: string) {
		selectedTeamRoles = selectedTeamRoles.filter((teamRole) => teamRole !== role);
	}
</script>

<Card.Header class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold text-center">Your team's activity list</h1>
</Card.Header>
{#if form}
	{#if form.error}
		<p class="text-red-500 text-center">{form.error}</p>
	{/if}
	{#if form.success}
		<p class="text-green-500 text-center">{form.success}</p>
	{/if}
{/if}
<Card.Content>
	{#if teamActivities.length === 0}
		<h2 class="text-lg text-center font-bold">
			There are currently no team activities here , you as the owner can add and remove activities
		</h2>
	{/if}
	{#each teamActivities as teamActivity}
		<div class="flex gap-2 items-center my-4">
			<p class="text-md font-bold text-blue-500">{teamActivity.activity_name}</p>
			<p class="text-md font-bold text-green-500">{teamActivity.points}</p>
			{#each teamActivity.activity_roles as role}
				<p class="text-sm text-gray-500">
					{role}
					{teamActivity.activity_roles.indexOf(role) === teamActivity.activity_roles.length - 1
						? ''
						: ','}
				</p>
			{/each}
		</div>
	{/each}
	<Dialog.Root>
		<Dialog.Trigger class="bg-blue-500  text-white w-1/4 mt-5 p-2 rounded"
			>Add team activity</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add a team activity</Dialog.Title>
				<Dialog.Description>
					You can set your team's activities here based on roles , so your team will know about them
					, and the points associated by them.
				</Dialog.Description>
			</Dialog.Header>
			<form method="POST" action="?/addTeamActivity">
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Name</Label>
						<input
							id="activityname"
							required
							name="activityname"
							class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="points" class="text-right">Points</Label>
						<input
							id="activitypoints"
							name="activitypoints"
							required
							placeholder="(Max 100 , Min -100)"
							type="number"
							max="100"
							min="-100"
							class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="roles" class="text-right">Roles:</Label>
						<div class="flex flex-col gap-4">
							{#if teamRoles.length === 0}
								<p class="text-md text-center mt-2 text-gray-500">
									Your currently have no roles in your team , set one so you can add activities
									later
								</p>
							{/if}
							{#each teamRoles as teamRole}
								{@const checked = selectedTeamRoles.includes(teamRole.role_name)}
								<div class="flex items-center space-x-3">
									<Checkbox
										id="role"
										{checked}
										onCheckedChange={(v) => {
											if (v) {
												addRole(teamRole.role_name);
											} else {
												removeRole(teamRole.role_name);
											}
										}}
									/>
									<Label for="role">{teamRole.role_name}</Label>
								</div>
							{/each}
						</div>
					</div>
				</div>
				<input type="hidden" value={selectedTeamRoles} name="teamroles" />
				<Button type="submit" class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
					>Add activity</Button
				>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</Card.Content>
<Card.Footer class="flex justify-between"></Card.Footer>
