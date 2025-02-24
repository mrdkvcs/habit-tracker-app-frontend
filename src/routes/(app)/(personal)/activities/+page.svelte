<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Card from '$lib/components/ui/card';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import { enhance } from '$app/forms';

	let deleteActivityDialog: HTMLDialogElement | undefined = $state();
	let addActivityDialog: HTMLDialogElement | undefined = $state();
	let activityNameInput: HTMLInputElement | undefined = $state();
	let activityPointsInput: HTMLInputElement | undefined = $state();
	let activityNameInputValue: string | undefined = $state('');
	let activityPointsInputValue: string | undefined = $state('');
	let selectedActivityId: string = $state('');

	interface Activity {
		activity_id: string;
		name: string;
		points: number;
		type: string;
		optionsopen: boolean;
	}
	let { data } = $props();

	let { formedActivities, token } = $state(data);
	let { form, errors, message } = superForm(data.form);

	function setInputValues() {
		activityNameInputValue = activityNameInput?.value;
		activityPointsInputValue = activityPointsInput?.value;
	}

	function setActivityName(e: Event) {
		const target = e.target as HTMLInputElement;
		if (activityNameInput != undefined) {
			activityNameInput.value = target.value;
			activityNameInputValue = activityNameInput.value;
		}
	}

	function setActivityPoints(e: Event) {
		const target = e.target as HTMLInputElement;
		if (activityPointsInput != undefined) {
			activityPointsInput.value = target.value;
			activityPointsInputValue = activityPointsInput.value;
		}
	}

	function setOptionsState(activity_id: string) {
		formedActivities = formedActivities.map((activity: Activity) => {
			if (activity.activity_id === activity_id) {
				return { ...activity, optionsopen: !activity.optionsopen };
			}
			return activity;
		});
	}

	async function checkActivityLogExists(activity_id: string) {
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
			toast.push(errorResponse.error, {
				theme: {
					'--toastColor': 'white',
					'--toastBackground': '#FF0000',
					'--toastBarBackground': '#FF0000'
				}
			});
		}

		const logExists = await response.json();
		if (logExists) {
			selectedActivityId = activity_id;
			deleteActivityDialog?.showModal();
			return;
		}

		removeActivity(activity_id);
	}

	async function removeActivity(activity_id: string) {
		const response = await fetch(`http://localhost:8080/activities/${activity_id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			const errorResponse = await response.json();
			toast.push(errorResponse.error, {
				theme: {
					'--toastColor': 'white',
					'--toastBackground': '#FF0000',
					'--toastBarBackground': '#FF0000'
				}
			});
			return;
		}
		const responseMessage = await response.json();
		toast.push(responseMessage, {
			theme: {
				'--toastColor': 'white',
				'--toastBackground': '#FF0000',
				'--toastBarBackground': '#FF0000'
			}
		});
		formedActivities = formedActivities.filter(
			(activity: Activity) => activity.activity_id !== activity_id
		);
	}

	function addActivity() {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const { activityId, activityName, activityPoints, activityType } = result.data;
				addActivityDialog?.close();
				toast.push('New activity added successfully!', {
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgba(72,187,120,0.9)',
						'--toastBarBackground': '#2F855A'
					}
				});
				formedActivities.push({
					activity_id: activityId,
					name: activityName,
					points: activityPoints,
					type: activityType,
					optionsopen: false
				});
			}
		};
	}
</script>

<Card.Content class="mt-10">
	<h1 class="text-xl font-bold mb-5">My activity list (points/hour)</h1>
	{#if $message}
		<p class="text-green-500">{$message}</p>
	{/if}
	<ul role="list" class="divide-y divide-gray-100">
		{#if formedActivities.length == 0}
			<h2 class="text-gray-500 text-center">You currently have no activities set</h2>
		{/if}
		{#each [...formedActivities].sort((a, b) => b.points - a.points) as activity}
			<dialog
				bind:this={deleteActivityDialog}
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
							deleteActivityDialog?.close();
							selectedActivityId = '';
						}}
						class="bg-blue-500 w-[100px] text-white p-1 rounded">Yes</button
					>
					<button onclick={() => deleteActivityDialog?.close()} class="text-red-500 bg-none"
						>Cancel</button
					>
				</div>
			</dialog>
			<li class="flex justify-between gap-x-4 py-5">
				<div class="flex items-center min-w-0 gap-x-4">
					<div class="min-w-0 flex-auto">
						<p class="text-lg font-semibold text-gray-900">
							{activity.name}
						</p>
					</div>
				</div>
				<div class="flex shrink-0 items-center gap-x-6">
					<div class="hidden sm:flex sm:flex-col sm:items-end">
						{#if activity.points > 0}
							<p class="text-md text-green-500">{activity.points} points</p>
						{:else}
							<p class="text-md text-red-500">{activity.points} points</p>
						{/if}
					</div>
					<div class="relative flex-none">
						<button
							type="button"
							onclick={() => setOptionsState(activity.activity_id)}
							class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900"
							id="options-menu-0-button"
							aria-expanded="false"
							aria-haspopup="true"
						>
							<span class="sr-only">Open options</span>
							<svg
								class="size-5"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
								/>
							</svg>
						</button>

						<!--
          Dropdown menu, show/hide based on menu state.

          Entering: "transition ease-out duration-100"
            From: "transform opacity-0 scale-95"
            To: "transform opacity-100 scale-100"
          Leaving: "transition ease-in duration-75"
            From: "transform opacity-100 scale-100"
            To: "transform opacity-0 scale-95"
        -->
						{#if activity.optionsopen}
							<div
								class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none transition transform ease-out duration-100"
								class:opacity-100={activity.optionsopen}
								class:scale-100={activity.optionsopen}
								class:opacity-0={!activity.optionsopen}
								class:scale-95={!activity.optionsopen}
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="options-menu-0-button"
								tabindex="-1"
							>
								<Dialog.Root>
									<Dialog.Trigger onclick={setInputValues} class="bg-none ml-3 text-blue-500"
										>Edit</Dialog.Trigger
									>
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
														oninput={setActivityName}
														id="activityname"
														bind:this={activityNameInput}
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
												disabled={activityNameInputValue === activity.name &&
													+activityPointsInputValue === activity.points}
												type="submit"
												class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
												>Edit
											</Button>
										</form>
									</Dialog.Content>
								</Dialog.Root>
								<button
									onclick={() => checkActivityLogExists(activity.activity_id)}
									class="block px-3 py-1 text-sm/6 text-red-500">Remove</button
								>
							</div>
						{/if}
					</div>
				</div>
			</li>
		{/each}
	</ul>
	<Button
		type="submit"
		onclick={() => {
			addActivityDialog?.showModal();
		}}
		class=" bg-blue-500 mt-6  text-white p-6 rounded"
		>New
	</Button>
	<dialog bind:this={addActivityDialog} class="p-10 rounded w-[500px] absolute left-[5%] top-[-5%]">
		<h2 class="text-lg font-bold">New activity</h2>
		<p class="text-gray-500">
			You can set your daily custom activities here , so our app will know about them , and the
			points associated by them.
		</p>
		<form method="POST" use:enhance={addActivity} action="?/addActivity">
			{#if $errors.activityName}
				<p class="text-red-500">{$errors.activityName}</p>
			{/if}
			{#if $errors.activityPoints}
				<p class="text-red-500 mt-5">{$errors.activityPoints}</p>
			{/if}
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<input
						id="activityName"
						bind:value={$form.activityName}
						required
						name="activityName"
						class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="username" class="text-right">Points</Label>
					<input
						id="activityPoints"
						name="activityPoints"
						bind:value={$form.activityPoints}
						required
						placeholder="(Max 10 , Min -10)"
						type="number"
						max="10"
						min="-10"
						class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
			<div class="flex items-center justify-between mt-5">
				<Button type="submit" class=" bg-blue-500 text-white  p-5 rounded">Add</Button>
				<button onclick={() => addActivityDialog?.close()} class="text-red-500 bg-none"
					>Cancel</button
				>
			</div>
		</form>
	</dialog>
</Card.Content>
