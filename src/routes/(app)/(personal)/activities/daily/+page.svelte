<script lang="ts">
	export let data;
	interface Form {
		error: string;
	}
	export let form: Form;
	import * as Card from '$lib/components/ui/card';
	const { dailyActivityLogs } = data;
</script>

{#if form}
	{#if form.error}
		<p class="text-red-500">{form.error}</p>
	{/if}
{/if}
<Card.Content>
	<h1 class="text-2xl font-bold mb-5">My daily activity list</h1>
	{#if dailyActivityLogs.length > 0}
		{#each dailyActivityLogs as dailyActivityLog}
			<div class="flex flex-col gap-2">
				<div class="flex gap-2 text-blue-500 mt-5">
					<h2>{dailyActivityLog.activity_name}</h2>
					<p>{dailyActivityLog.points} points</p>
					<p>
						{Math.floor(dailyActivityLog.duration / 60)} hour(s) {dailyActivityLog.duration -
							Math.floor(dailyActivityLog.duration / 60) * 60} minutes
					</p>
					<p>{dailyActivityLog.start_time} - {dailyActivityLog.end_time}</p>
				</div>
			</div>
		{/each}
	{:else}
		<h1 class="text-lg font-bold mb-5">There are no daily activites today</h1>
	{/if}
</Card.Content>
