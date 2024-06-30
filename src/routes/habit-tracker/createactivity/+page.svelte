<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	let activityName = '';
	let activityId = '';
	let activityPoints = 0;
	let startTime = '';
	let endTime = '';
	let userActivities: UserActivity[] = [];
	let suggestions: UserActivity[] = [];
	interface Form {
		error: string;
	}
	interface UserActivity {
		activity_id: string;
		name: string;
		points: number;
		type: string;
	}
	export let form: Form;
	export let data;
	let today = new Date().toISOString().slice(0, 10);
	if (data.activities) {
		userActivities = data.activities;
	}
	function filterSuggestions() {
		if (activityName.trim() === '') {
			suggestions = [];
			return;
		}
		suggestions = userActivities.filter((activity) =>
			activity.name.toLowerCase().includes(activityName.toLowerCase())
		);
	}
	function selectSuggestion(suggestion: UserActivity) {
		activityName = suggestion.name;
		activityPoints = suggestion.points;
		activityId = suggestion.activity_id;
		suggestions = [];
	}
</script>

{#if form}
	{#if form.error}
		<p class="text-red-500 text-center">{form.error}</p>
	{/if}
  {#if form.success}
    <div class="flex gap-2 justify-center items-center">
		    <p class="text-green-500 text-center">{form.success}</p>
        <a href="/habit-tracker/dailyactivitylist" class="text-blue-500 underline">You can watch your daily activities here</a>
    </div>
  {/if}
{/if}
<h1 class="text-center font-bold text-2xl mb-5">Set an activity for today</h1>
<div class="flex gap-2 justify-center items-center">
 <p class="text-center mb-5 mt-5 text-gray-500">You can only set activities from your</p>
 <a class="text-blue-500 underline" href="/habit-tracker/myactivitylist">activity list</a>
</div>
<form action="?/setActivity" method="POST" class="flex flex-col">
  <input type="hidden" name="activityId" bind:value={activityId} />
  <input type="hidden" name="activityPoints" bind:value={activityPoints} />
	<input
		type="text"
		on:input={filterSuggestions}
		required
		bind:value={activityName}
    name="activityName"
		class="mx-auto mb-5 border border-blue-500 p-2 text-center rounded"
		placeholder="Activity name"
	/>
	{#if suggestions.length > 0}
		<div class="flex flex-col gap-2 mx-auto">
			{#each suggestions as suggestion (suggestion.activity_id)}
				<div role="button" tabindex="0" on:click={() => selectSuggestion(suggestion)}>
					<p class="text-blue-500">{suggestion.name}</p>
				</div>
			{/each}
		</div>
	{/if}
	<div class="flex gap-5 mb-5">
		<div class="flex gap-2">
			<p class="text-lg text-gray-500">Start time of the activity:</p>
			<input
				required
				type="datetime-local"
        name="startTime"
				bind:value={startTime}
				min={today + 'T00:00'}
				max={today + 'T23:59'}
			/>
		</div>
		<div class="flex gap-2">
			<p class="text-lg text-gray-500">End time of the activity:</p>
			<input
				required
				type="datetime-local"
        name="endTime"
				min={today + 'T00:00'}
				bind:value={endTime}
				max={today + 'T23:59'}
			/>
		</div>
	</div>
	<Button disabled={!userActivities.some((activity) => activity.name === activityName)} type="submit" class="bg-blue-500 mt-5 mx-auto ">Set the activity</Button>
</form>
