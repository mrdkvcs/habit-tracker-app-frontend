<script lang="ts">
	export let data;
	import * as Dialog from '$lib/components/ui/dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	const { members, teamid } = data;
	let errorMessage: string = '';
	interface Form {
		error: string;
		success: string;
	}
	interface Role {
		id: string;
		role_name: string;
	}
	export let form: Form;
	let notAssignedRoles: Role[] = [];
	let selectedRoles: string[] = [];
	async function getNotAssignedRoles(membership_id: string) {
		const response = await fetch(`http://localhost:8080/teams/${teamid}/roles/${membership_id}`);
		if (!response.ok) {
			errorMessage = "Error getting user's not assigned roles";
			return;
		}
		notAssignedRoles = await response.json();
	}
	function addRole(roleId: string) {
		selectedRoles = [...selectedRoles, roleId];
	}
	function removeRole(roleId: string) {
		selectedRoles = selectedRoles.filter((role) => role !== roleId);
	}
</script>

{#if form}
	{#if form.error}
		<p class="text-red-500 text-center">{form.error}</p>
	{/if}
	{#if form.success}
		<p class="text-green-500 text-center">{form.success}</p>
	{/if}
{/if}
{#if data.error}
	<p class="text-red-500 text-center">
		There was an error getting your team members , try again later
	</p>
{/if}
{#if errorMessage}
	<p class="text-red-500 text-center">
		{errorMessage}
	</p>
{/if}

<h2 class="font-bold text-xl ml-4">Your team members:</h2>
{#if members?.length > 0}
	{#each members as member}
		<div class="flex gap-4 ml-5 mt-5 items-center">
			<p class="text-blue-500 text-lg">{member.username}</p>
			{#if member.roles === ''}
				<p class="text-gray-500">This member currently dont have any roles</p>
			{:else}
				{#each member.roles.split(',') as role}
					<p class="text-gray-500">
						{role.charAt(0).toUpperCase() + role.slice(1)}
						{member.roles.split(',').indexOf(role) === member.roles.split(',').length - 1
							? ''
							: ','}
					</p>
				{/each}
			{/if}
			<Dialog.Root>
				<Dialog.Trigger
					on:click={() => getNotAssignedRoles(member.id)}
					class="bg-white-500  text-blue-500">Assign roles</Dialog.Trigger
				>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Assign Roles</Dialog.Title>
						<Dialog.Description>
							You can assign roles to the user so they can set activities associated by their roles
						</Dialog.Description>
					</Dialog.Header>
					<div class="grid gap-4 py-4">
						<form method="POST" action="?/setMemberRoles">
							{#if notAssignedRoles.length === 0}
								<p class="text-gray-500 font-bold">This user currently has all roles assigned</p>
							{/if}
							{#each notAssignedRoles as notAssignedRole}
								{@const checked = selectedRoles.includes(notAssignedRole.id)}
								<div class="flex mt-2 items-center space-x-3">
									<Checkbox
										id="role"
										{checked}
										onCheckedChange={(v) => {
											if (v) {
												addRole(notAssignedRole.id);
											} else {
												removeRole(notAssignedRole.id);
											}
										}}
									/>
									<Label for="role"
										>{notAssignedRole.role_name.charAt(0).toUpperCase() +
											notAssignedRole.role_name.slice(1)}</Label
									>
								</div>
							{/each}
							<Button type="submit" class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
								>Assign Roles</Button
							>
							<input type="hidden" value={selectedRoles} name="selectedRoles" />
							<input type="hidden" value={member.id} name="teamMembershipId" />
						</form>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/each}
{:else}
	<h2 class="text-lg font-bold text-gray-500 text-center mt-5">
		Your currently dont have any members in your team
	</h2>
{/if}
