<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	const { user } = data;
	let dialog: HTMLDialogElement = $state();
	let successMessage: string = $state('');
	let errorMessage: string = $state('');
	let matchedActivities: MatchedActivity = $state();
	interface MatchedActivity {
		matched_activities: Activity[];
		duration: number;
		description: string;
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
		data: any;
		form: Form;
	}

	let { data, form }: Props = $props();
	async function setActivityLog() {
		errorMessage = '';
		successMessage = '';
		const response = await fetch('http://localhost:8080/activities/logs', {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${user.api_key}`
			},
			body: JSON.stringify({ activity_input: activityInput })
		});
		if (response.ok) {
			const matchedActivitiesResponse = await response.json();
			if (matchedActivitiesResponse.length === 1) {
				successMessage = 'Activity logged successfully';
				activityInput = '';
				return;
			}
			matchedActivities = matchedActivitiesResponse;
			activityInput = '';
			dialog.showModal();
		} else {
			const errorResponse = await response.json();
			errorMessage = errorResponse.error;
		}
	}

	let activityInput: string = $state('');
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
		bind:this={dialog}
		class="p-5 rounded w-[500px] absolute left-[5%] top-[-5%] transition ease-in-out"
	>
		<h2 class="text-lg font-bold">
			We have noticed that there are multiple potential matches for the typed activity, please
			select the one that you meant
		</h2>
		{#if matchedActivities?.matched_activities.length > 0}
			<div class="flex flex-col gap-2 mt-2">
				{#each matchedActivities.matched_activities as matchedActivity}
					<div class="flex gap-2">
						<form method="POST" action="?/setSpecificActivity">
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
					</div>
				{/each}
				<button onclick={() => dialog.close()} class="text-red-500 text-left mt-2">Cancel</button>
			</div>
		{/if}
	</dialog>
	<h1 class="text-center font-bold text-2xl mb-5">Set an activity for today</h1>
	<div class="flex gap-2 justify-center items-center">
		<p class="text-center mb-5 mt-5 text-gray-500">
			You can only set activities associated by your
		</p>
		<a class="text-blue-500 underline" href="/activities">activity list</a>
	</div>
	<form onsubmit={preventDefault(setActivityLog)} method="POST" class="flex flex-col">
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
