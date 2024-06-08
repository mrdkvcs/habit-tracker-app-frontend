<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	interface Activity {
		name: string;
		points: number;
		type: string;
	}
	interface PageData {
		activities: Activity[];
	}
	export let data: PageData;
	const { activities } = data;
</script>

<h1 class="text-xl font-bold mb-5">My activity list</h1>
<div class="flex flex-col gap-2">
	{#each activities as activity}
		<div class="flex gap-2 items-center">
			<h2 class="text-blue-500 text-lg">{activity.name}</h2>
			{#if activity.points > 0}
				<h2 class="text-green-500">{activity.points}</h2>
			{:else}
				<h2 class="text-red-500">{activity.points}</h2>
			{/if}
			{#if activity.type === 'default'}
				<p class="text-gray-400">default</p>
			{/if}
		</div>
	{/each}
	<Dialog.Root>
		<Dialog.Trigger class="bg-blue-500 text-white w-1/4 mt-5 p-2 rounded"
			>Add custom activity</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add a custom activity</Dialog.Title>
				<Dialog.Description>
					You can set your daily custom activities here , so our app will know about them , and the
					points associated by them.
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
							placeholder="(Max 100 , Min -100)"
							type="number"
							max="100"
							min="-100"
							class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>
				<Button type="submit" class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded"
					>Add activity</Button
				>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
