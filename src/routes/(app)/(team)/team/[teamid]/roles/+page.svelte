<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	export let data: PageData;
	interface Form {
		error: string;
		success: string;
	}
	const { teamRoles } = data;
	export let form: Form;
</script>

<Card.Header class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold text-center">Your team's roles</h1>
</Card.Header>
{#if data.error}
	<p class="text-red-500 text-center">{data.error}</p>
{/if}
{#if form}
	{#if form.error}
		<p class="text-red-500 text-center">{form.error}</p>
	{/if}
	{#if form.success}
		<p class="text-green-500 text-center">{form.success}</p>
	{/if}
{/if}
<Card.Content>
	{#if teamRoles.length === 0}
		<p class="text-md text-center mt-2 text-gray-500">You currently have no roles in your team</p>
	{/if}
	{#each teamRoles as teamRole}
		<h2 class="text-lg mt-2 font-bold text-blue-500">
			{teamRole.role_name.charAt(0).toUpperCase() + teamRole.role_name.slice(1)}
		</h2>
	{/each}
	<Dialog.Root>
		<Dialog.Trigger class="bg-blue-500  text-white w-1/4 mt-5 p-2 rounded"
			>Add team role</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add a team role</Dialog.Title>
				<Dialog.Description>
					You can set your team's roles here. After you set them, you can set activities for them at
					the <a class="text-blue-500" href={`/team/${data.teamid}/activities`}>Team Activities</a> section
				</Dialog.Description>
			</Dialog.Header>
			<form method="POST" action="?/addrole">
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Name</Label>
						<input
							id="rolename"
							required
							name="rolename"
							class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input type="hidden" value={data.teamid} name="teamid" />
					</div>
				</div>
				<Button type="submit" class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
					>Add role</Button
				>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</Card.Content>
<Card.Footer class="flex justify-between"></Card.Footer>
