<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Card from '$lib/components/ui/card';
	let dialog: HTMLDialogElement = $state();
	let activityNameInput: HTMLInputElement = $state();
	let activityPointsInput: HTMLInputElement = $state();
	let successMessage: string = $state('');
	let errorMessage: string = $state('');
	let selectedActivityId: string = $state('');
	interface Activity {
		activity_id: string;
		name: string;
		points: number;
		type: string;
	}
	let { data, form } = $props();

	let { activities, token } = $state(data);

	function setActivityName(e: Event) {
		const target = e.target as HTMLInputElement;
		activityNameInput.value = target.value;
	}

	function setActivityPoints(e: Event) {
		const target = e.target as HTMLInputElement;
		activityPointsInput.value = target.value;
	}

	async function checkActivityLogExists(activity_id: string) {
		errorMessage = '';
		successMessage = '';
		const response = await fetch(
			`http://localhost:8080/activities/logs/exist?activity_id=${activity_id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
		if (!response.ok) {
			const errorResponse = await response.json();
			errorMessage = errorResponse.error;
		}

		const logExists = await response.json();
		if (logExists) {
			selectedActivityId = activity_id;
			dialog.showModal();
			return;
		}

		removeActivity(activity_id);
	}

	async function removeActivity(activity_id: string) {
		errorMessage = '';
		successMessage = '';
		const response = await fetch(`http://localhost:8080/activities/${activity_id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			const errorResponse = await response.json();
			errorMessage = errorResponse.error;
			return;
		}
		const responseMessage = await response.json();
		successMessage = responseMessage;
		activities = activities.filter((activity: Activity) => activity.activity_id !== activity_id);
	}
</script>

<h1 class="text-xl font-bold mb-5 ml-5">My activity list (points/hour)</h1>

{#if form}
	{#if form.error}
		<p class="text-red-500 my-2 ml-5">{form.error}></p>
	{/if}
	{#if form.success}
		<p class="text-green-500 my-2 ml-5">{form.success}</p>
	{/if}
{/if}

{#if errorMessage}
	<p class="text-red-500 my-2 ml-5">{errorMessage}</p>
{/if}
{#if successMessage}
	<p class="text-green-500 my-2 ml-5">{successMessage}</p>
{/if}

<Card.Content>
	<div class="flex flex-col gap-2">
		{#if activities.length === 0}
			<h2 class="text-gray-500 text-lg text-center">You currently don't have any activities</h2>
		{/if}
		{#each activities as activity}
			<dialog
				bind:this={dialog}
				class="p-10 rounded w-[500px] absolute left-[5%] top-[-5%] transition ease-in-out"
			>
				<h2 class="text-lg font-bold">Are you sure you want to delete this activity?</h2>
				<p class="text-gray-500">
					You have activity like that set in our system and this will affect the accuracy of your
					data insights.
				</p>
				<div class="flex gap-5 items-center mt-5">
					<button
						onclick={() => {
							removeActivity(selectedActivityId);
							dialog.close();
							selectedActivityId = '';
						}}
						class="bg-blue-500 w-[100px] text-white p-1 rounded">Yes</button
					>
					<button onclick={() => dialog.close()} class="text-red-500 bg-none">Cancel</button>
				</div>
			</dialog>
			<div class="flex gap-2 items-center mt-2">
				<h2 class="text-blue-500 text-lg">{activity.name}</h2>
				{#if activity.points > 0}
					<h2 class="text-green-500">{activity.points}</h2>
				{:else}
					<h2 class="text-red-500">{activity.points}</h2>
				{/if}
				{#if activity.type === 'default'}
					<p class="text-gray-500">default</p>
				{/if}
				<Dialog.Root>
					<Dialog.Trigger class="bg-none ml-2 text-blue-500">Edit</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Edit activity</Dialog.Title>
						</Dialog.Header>
						<form method="POST" action="?/editActivity">
							<div class="grid gap-4 py-4">
								<div class="grid grid-cols-4 items-center gap-4">
									<Label for="name" class="text-right">Name</Label>
									<input
										value={activity.name}
										bind:this={activityNameInput}
										oninput={setActivityName}
										id="activityname"
										required
										name="activityname"
										class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div class="grid grid-cols-4 items-center gap-4">
									<Label for="username" class="text-right">Points</Label>
									<input
										id="activitypoints"
										name="activitypoints"
										required
										placeholder="(Max 10 , Min -10)"
										value={activity.points}
										oninput={setActivityPoints}
										bind:this={activityPointsInput}
										type="number"
										max="10"
										min="-10"
										class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
							<input type="hidden" value={activity.activity_id} name="activityid" />
							<Button
								disabled={activityNameInput?.value === activity.name &&
									+activityPointsInput?.value == activity.points}
								type="submit"
								class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
								>Edit
							</Button>
						</form>
					</Dialog.Content>
				</Dialog.Root>
				<button
					onclick={() => checkActivityLogExists(activity.activity_id)}
					class="bg-none text-red-500">Remove</button
				>
			</div>
		{/each}
		<Dialog.Root>
			<Dialog.Trigger class="bg-blue-500 text-white w-1/4 mt-5 p-2 rounded">New</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>New activity</Dialog.Title>
					<Dialog.Description>
						You can set your daily custom activities here , so our app will know about them , and
						the points associated by them.
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
							<Label for="username" class="text-right">Points</Label>
							<input
								id="activitypoints"
								name="activitypoints"
								required
								placeholder="(Max 10 , Min -10)"
								type="number"
								max="10"
								min="-10"
								class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
					<Button type="submit" class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
						>Add
					</Button>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</Card.Content>
