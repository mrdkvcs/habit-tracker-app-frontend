<script lang="ts">
	interface Form {
		error: string;
	}
	import * as Card from '$lib/components/ui/card';
	interface Props {
		data: any;
		form: Form;
	}

	let { data, form }: Props = $props();
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
					<h2>{dailyActivityLog.name}</h2>
					<p>{dailyActivityLog.points} points</p>
					<p>
						{Math.floor(dailyActivityLog.duration / 60)} hour(s) {dailyActivityLog.duration -
							Math.floor(dailyActivityLog.duration / 60) * 60} minutes
					</p>
					<p class="text-gray-500">{dailyActivityLog.activity_description}</p>
				</div>
			</div>
		{/each}
	{:else}
		<h1 class="text-lg font-bold mb-5">There are no daily activites today</h1>
	{/if}
</Card.Content>
