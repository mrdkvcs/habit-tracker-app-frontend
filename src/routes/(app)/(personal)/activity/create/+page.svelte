<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import * as Card from '$lib/components/ui/card';
	import { enhance } from '$app/forms';

	interface Activity {
		activity_id: string;
		name: string;
		points: number;
		type: string;
	}

	interface MatchedActivityResponse {
		matched_activities: Activity[];
		duration: number;
		description: string;
		name: string;
	}

	let multiplematchedActvitiesDialog: HTMLDialogElement | undefined = $state();
	let nomatchedActivitiesDialog: HTMLDialogElement | undefined = $state();
	let oneTime: boolean = $state(false);
	let matchedActivities: MatchedActivityResponse | undefined = $state();
	let activityInput = $state('');

	function setActivityLogSubmit() {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const { matchedActivitieslength } = result.data;
				if (matchedActivitieslength === 1) {
					if (result.data.streakCount === undefined && result.data.isStreakRecord === undefined) {
						toast.push('Activity set successfully!', {
							theme: {
								'--toastColor': 'mintcream',
								'--toastBackground': 'rgba(72,187,120,0.9)',
								'--toastBarBackground': '#2F855A'
							}
						});
					}
					if (result.data.streakCount && result.data.isStreakRecord === true) {
						toast.push(
							`You are on a ${result.data.streakCount} ${result.data.streakCount === 1 ? 'day' : 'days'} streak! Keep going! New streak record also set!🔥`,
							{
								theme: {
									'--toastColor': 'mintcream',
									'--toastBackground': 'rgba(72,187,120,0.9)',
									'--toastBarBackground': '#2F855A'
								}
							}
						);
					} else if (result.data.streakCount && result.data.isStreakRecord === false) {
						toast.push(
							`You are on a ${result.data.streakCount} ${result.data.streakCount === 1 ? 'day' : 'days'} streak! Keep going! 🔥`,
							{
								theme: {
									'--toastColor': 'mintcream',
									'--toastBackground': 'rgba(72,187,120,0.9)',
									'--toastBarBackground': '#2F855A'
								}
							}
						);
					}
				} else if (matchedActivitieslength > 1) {
					matchedActivities = result.data.matchedActivitiesResponse;
					multiplematchedActvitiesDialog?.showModal();
				} else {
					matchedActivities = result.data.matchedActivitiesResponse;
					nomatchedActivitiesDialog?.showModal();
				}
			} else {
				toast.push(`There was an error setting the activity log: ${result.data.error}`, {
					theme: {
						'--toastColor': 'white',
						'--toastBackground': '#FF0000',
						'--toastBarBackground': '#FF0000'
					}
				});
			}
		};
	}
	function setSpecificActivityLogSubmit() {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				if (result.data.streakCount === undefined && result.data.isStreakRecord === undefined) {
					toast.push('Activity set successfully!', {
						theme: {
							'--toastColor': 'mintcream',
							'--toastBackground': 'rgba(72,187,120,0.9)',
							'--toastBarBackground': '#2F855A'
						}
					});
				}
				if (result.data.streakCount && result.data.isStreakRecord === true) {
					toast.push(
						`You are on a ${result.data.streakCount} ${result.data.streakCount === 1 ? 'day' : 'days'} streak! Keep going! New streak record also set!🔥`,
						{
							theme: {
								'--toastColor': 'mintcream',
								'--toastBackground': 'rgba(72,187,120,0.9)',
								'--toastBarBackground': '#2F855A'
							}
						}
					);
				} else if (result.data.streakCount && result.data.isStreakRecord === false) {
					toast.push(
						`You are on a ${result.data.streakCount} ${result.data.streakCount === 1 ? 'day' : 'days'} streak! Keep going! 🔥`,
						{
							theme: {
								'--toastColor': 'mintcream',
								'--toastBackground': 'rgba(72,187,120,0.9)',
								'--toastBarBackground': '#2F855A'
							}
						}
					);
				}
				multiplematchedActvitiesDialog?.close();
			} else {
				toast.push(`There was an error setting the activity log: ${result.data.error}`, {
					theme: {
						'--toastColor': 'white',
						'--toastBackground': '#FF0000',
						'--toastBarBackground': '#FF0000'
					}
				});
				multiplematchedActvitiesDialog?.close();
			}
		};
	}
	function setNewActivityLogSubmit() {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				if (result.data.streakCount === undefined && result.data.isStreakRecord === undefined) {
					toast.push('New activity set successfully!', {
						theme: {
							'--toastColor': 'mintcream',
							'--toastBackground': 'rgba(72,187,120,0.9)',
							'--toastBarBackground': '#2F855A'
						}
					});
				}
				if (result.data.streakCount && result.data.isStreakRecord === true) {
					toast.push(
						`You are on a ${result.data.streakCount} ${result.data.streakCount === 1 ? 'day' : 'days'} streak! Keep going! New streak record also set!🔥`,
						{
							theme: {
								'--toastColor': 'mintcream',
								'--toastBackground': 'rgba(72,187,120,0.9)',
								'--toastBarBackground': '#2F855A'
							}
						}
					);
				} else if (result.data.streakCount && result.data.isStreakRecord === false) {
					toast.push(
						`You are on a ${result.data.streakCount} ${result.data.streakCount === 1 ? 'day' : 'days'} streak! Keep going! 🔥`,
						{
							theme: {
								'--toastColor': 'mintcream',
								'--toastBackground': 'rgba(72,187,120,0.9)',
								'--toastBarBackground': '#2F855A'
							}
						}
					);
				}
				nomatchedActivitiesDialog?.close();
			} else {
				toast.push(`There was an error setting the new activity log: ${result.data.error}`, {
					theme: {
						'--toastColor': 'white',
						'--toastBackground': '#FF0000',
						'--toastBarBackground': '#FF0000'
					}
				});
				nomatchedActivitiesDialog?.close();
			}
		};
	}
</script>

<Card.Content class="mt-10">
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
						<form
							class="flex gap-2"
							method="POST"
							action="?/setSpecificActivityLog"
							use:enhance={setSpecificActivityLogSubmit}
						>
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
					onclick={() => multiplematchedActvitiesDialog?.close()}
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
				<form
					method="POST"
					action="?/setNewActivityLog"
					class="flex flex-col gap-2"
					use:enhance={setNewActivityLogSubmit}
				>
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
					<Label for="oneTimeSet">Dont save to my activity list</Label>
					<input id="oneTime" name="oneTime" type="hidden" bind:value={oneTime} />
					<div class="flex items-center">
						<Button class="bg-blue-500 mt-5" type="submit">Set new activity</Button>
					</div>
				</form>
				<button
					onclick={() => nomatchedActivitiesDialog?.close()}
					class="text-red-500 text-right absolute bottom-6 right-6">Cancel</button
				>
			{/if}
		</div>
	</dialog>

	<h1 class="text-center font-bold text-2xl mb-5">Tell me what you have done today.</h1>

	<div class="flex gap-2 justify-center items-center">
		<p class="text-center mb-5 mt-5 text-gray-500">
			You can only set activities associated by your
		</p>
		<a class="text-blue-500 underline" href="/activities">activity list</a>
	</div>
	<form
		method="POST"
		action="?/setActivityLog"
		use:enhance={setActivityLogSubmit}
		class="flex flex-col"
	>
		<input
			type="text"
			autocomplete="off"
			required
			name="activityInput"
			bind:value={activityInput}
			class="w-full mx-auto mb-5 border border-blue-500 p-2 text-center rounded"
			placeholder="Type the activity and the duration for how long you did them (eg : Learning for 2 hours)"
		/>
		<Button
			disabled={activityInput.trim() === ''}
			type="submit"
			class="bg-blue-500 px-8 mt-5 mx-auto ">Send</Button
		>
	</form>
</Card.Content>
