<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import * as Card from '$lib/components/ui/card';
	let multiplematchedActvitiesDialog: HTMLDialogElement = $state();
	let nomatchedActivitiesDialog: HTMLDialogElement = $state();
	let successMessage: string = $state('');
	let activityInput: string = $state('');
	let errorMessage: string = $state('');
	let oneTime: boolean = $state(false);
	let matchedActivities: MatchedActivity = $state();
	interface MatchedActivity {
		matched_activities: Activity[];
		duration: number;
		description: string;
		name: string;
	}

	interface Activity {
		activity_id: string;
		name: string;
		points: number;
		type: string;
	}

	interface Form {
		success: string;
		error: string;
	}

	interface Props {
		data: PageData;
		form: Form;
	}

	let { data, form }: Props = $props();
	const { token } = data;

	async function setActivityLog(e: Event) {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';
		const response = await fetch('http://localhost:8080/activities/logs', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ activity_input: activityInput })
		});
		if (response.ok) {
			const matchedActivitiesResponse = await response.json();
			if (matchedActivitiesResponse.matched_activities.length === 1) {
				successMessage = 'Activity logged successfully';
				activityInput = '';
				return;
			} else if (matchedActivitiesResponse.matched_activities.length > 1) {
				matchedActivities = matchedActivitiesResponse;
				activityInput = '';
				multiplematchedActvitiesDialog.showModal();
			} else {
				matchedActivities = matchedActivitiesResponse;
				activityInput = '';
				nomatchedActivitiesDialog.showModal();
			}
		} else {
			const errorResponse = await response.json();
			errorMessage = errorResponse.error;
		}
	}
</script>

{#if form}
	{#if form.success}
		<p class="text-green-500 text-center">{form.success}</p>
	{/if}
	{#if form.error}
		<p class="text-red-500 text-center">{form.error}</p>
	{/if}
{/if}

{#if errorMessage}
	<p class="text-red-500 text-center">{errorMessage}</p>
{/if}

{#if successMessage}
	<div class="flex gap-2 justify-center items-center">
		<p class="text-green-500 text-center">{successMessage}</p>
		<a href="/activities/daily" class="text-blue-500 underline"
			>You can watch your daily activities here</a
		>
	</div>
{/if}

<Card.Content>
	<dialog
		bind:this={multiplematchedActvitiesDialog}
		class="p-5 rounded w-[500px] absolute left-[5%] top-[-5%] transition ease-in-out"
	>
		<h2 class="text-lg font-bold">
			We have noticed that there are multiple potential matches for the typed activity, please
			select the one that you meant
		</h2>
		{#if matchedActivities?.matched_activities.length > 0}
			<div class="flex flex-col gap-2 mt-2">
				{#if matchedActivities}
					{#each matchedActivities.matched_activities as matchedActivity}
						<form class="flex gap-2" method="POST" action="?/setSpecificActivity">
							<button type="submit" class="text-blue-500">{matchedActivity.name}</button>
							{#if matchedActivity.points > 0}
								<p class="text-green-500">{matchedActivity.points} / hour</p>
							{:else}
								<p class="text-red-500">{matchedActivity.points} / hour</p>
							{/if}
							<input type="hidden" name="activity_id" value={matchedActivity.activity_id} />
							<input type="hidden" name="activity_name" value={matchedActivity.name} />
							<input type="hidden" name="activity_points" value={matchedActivity.points} />
							<input type="hidden" name="activity_duration" value={matchedActivities.duration} />
							<input
								type="hidden"
								name="activity_description"
								value={matchedActivities.description}
							/>
						</form>
					{/each}
				{/if}
				<button
					onclick={() => multiplematchedActvitiesDialog.close()}
					class="text-red-500 text-left mt-2">Cancel</button
				>
			</div>
		{/if}
	</dialog>
	<dialog
		bind:this={nomatchedActivitiesDialog}
		class="p-5 rounded w-[500px] absolute left-[5%] top-[-5%] transition ease-in-out"
	>
		<h2 class="text-lg font-bold">
			Oh , we are detecting that the typed activitiy is not set in your activity list , but you can
			add it now , how much points would you give to the typed activity?
		</h2>
		<div class="flex flex-col gap-5 mt-2">
			{#if matchedActivities}
				<h2 class="font-bold">Activity name : {matchedActivities.name}</h2>
				<form method="POST" class="flex flex-col gap-2" action="?/setNewActivity">
					<input
						id="activityPoints"
						name="activityPoints"
						required
						placeholder="(Max 10 , Min -10)/hour"
						type="number"
						max="10"
						min="-10"
						class="col-span-3 rounded border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<input
						id="activityName"
						name="activityName"
						type="hidden"
						value={matchedActivities.name}
					/>
					<input
						id="activityDuration"
						name="activityDuration"
						type="hidden"
						value={matchedActivities.duration}
					/>
					<input
						id="activityDescription"
						name="activityDescription"
						type="hidden"
						value={matchedActivities.description}
					/>
					<Switch id="oneTimeSet" bind:checked={oneTime} />
					<Label for="oneTimeSet">Just one time</Label>
					<input id="oneTime" name="oneTime" type="hidden" value={oneTime} />
					<div class="flex items-center mt-5 justify-between gap-2">
						<Button class="bg-blue-500" type="submit">Set new activity</Button>
						<button
							onclick={() => nomatchedActivitiesDialog.close()}
							class="text-red-500 text-left mt-2">Cancel</button
						>
					</div>
				</form>
			{/if}
		</div>
	</dialog>
	<h1 class="text-center font-bold text-2xl mb-5">Set an activity for today</h1>
	<div class="flex gap-2 justify-center items-center">
		<p class="text-center mb-5 mt-5 text-gray-500">
			You can only set activities associated by your
		</p>
		<a class="text-blue-500 underline" href="/activities">activity list</a>
	</div>
	<form onsubmit={setActivityLog} class="flex flex-col">
		<input
			type="text"
			autocomplete="off"
			required
			bind:value={activityInput}
			name="activityInput"
			class="w-full mx-auto mb-5 border border-blue-500 p-2 text-center rounded"
			placeholder="Type the activity and the duration for how long you did them (eg : Learning for 2 hours)"
		/>
		<Button disabled={activityInput.trim() === ''} type="submit" class="bg-blue-500 mt-5 mx-auto "
			>Set the activity</Button
		>
	</form>
</Card.Content>
