<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	let startTime = '';
	let endTime = '';
	let today = new Date().toISOString().slice(0, 10);
</script>

<Card.Content>
	<h1 class="text-center font-bold text-2xl mb-5">Set an activity for the team</h1>
	<div class="flex gap-2 justify-center items-center">
		<p class="text-center mb-5 mt-5 text-gray-500">You can only set activities from your</p>
		<a class="text-blue-500 underline" href="/teams">team activity list</a>
	</div>
	<form action="?/setActivity" method="POST" class="flex flex-col">
		<input type="hidden" name="activityId" />
		<input type="hidden" name="activityPoints" />
		<input
			type="text"
			autocomplete="off"
			required
			name="activityName"
			class="mx-auto mb-5 border border-blue-500 p-2 text-center rounded"
			placeholder="Activity name"
		/>
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
		<Button type="submit" class="bg-blue-500 mt-5 mx-auto ">Set the activity</Button>
	</form>
</Card.Content>
