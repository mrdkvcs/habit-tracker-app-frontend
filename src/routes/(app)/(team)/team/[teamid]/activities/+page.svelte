<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	interface Form {
		error: string;
	}
	let formattedDate = ' ';
	export let data: PageData;
	export let form: Form;
	const { teamactivities } = data;
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

<Card.Header class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold text-center">Your team's activity list</h1>
	<h2 class="text-xl">Today : {formattedDate}</h2>
</Card.Header>
{#if form}
	{#if form.error}
		<p class="text-red-500 text-center">{form.error}</p>
	{/if}
{/if}
<Card.Content>
	{#if teamactivities.length === 0}
		<h2 class="text-lg text-center font-bold">
			There are currently no team activities here , you as the owner can add and remove activities
		</h2>
	{/if}
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
			<form method="POST" action="?/addactivity">
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
						<Label for="role" class="text-right">Role</Label>
						<Select.Root portal={null}>
							<Select.Trigger class="w-[180px] mx-auto mt-5">
								<Select.Value placeholder="Select a role for the activity" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Select a role for the activity</Select.Label>
									<Select.Item value="lastYear">Developer</Select.Item>
									<Select.Item value="lastYear">Sales manager</Select.Item>
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<Button type="submit" class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
					>Add activity</Button
				>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</Card.Content>
<Card.Footer class="flex justify-between"></Card.Footer>
