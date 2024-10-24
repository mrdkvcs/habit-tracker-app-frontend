<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Progress } from '$lib/components/ui/progress';
	let formattedDate = '';
	export let data;
	const { user, dailyPoints } = data;
	onMount(() => {
		const date = new Date();
		formattedDate = date
			.toLocaleDateString('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
			.replace(/\//g, ' ');
	});
</script>

<Card.Header class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold text-center">Hey welcome , {user.username}</h1>
	<h2 class="text-xl">Today : {formattedDate}</h2>
	<div class="flex flex-col items-center justify-center gap-2">
		{#if dailyPoints.goal_points === 0}
			<p class="text-sm text-gray-500">
				Total productivity points for today: {dailyPoints.total_points}
			</p>
		{/if}
		{#if dailyPoints.goal_points === 0}
			<Dialog.Root>
				<Dialog.Trigger class="text-blue-500 w-1/4 mt-5 p-2 rounded"
					>Set productivity goal for today</Dialog.Trigger
				>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Set productivity goal</Dialog.Title>
						<Dialog.Description
							>You can set your productivity goal for today here , and we will encourage you through
							email throughout the day if you allow us
						</Dialog.Description>
					</Dialog.Header>
					<form method="POST" action="?/addprodgoal">
						<div class="grid gap-4 py-4">
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="username" class="text-right">Points Goal</Label>
								<input
									id="goalpoints"
									name="goalpoints"
									required
									placeholder="(Min 3000)"
									type="number"
									min="3000"
									class="col-span-3 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
						<Button type="submit" class=" bg-blue-500 float-right text-white  mt-5 p-2 rounded">
							Set goal</Button
						>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		{:else if dailyPoints.total_points >= dailyPoints.goal_points}
			<h2 class="text-green-500 font-bold text-center">
				Productivity goal achieved for the day! Congrats!
			</h2>
		{:else}
			<Progress value={dailyPoints.total_points} max={dailyPoints.goal_points} class="w-[60%]" />
			<p>Productivity goal : {dailyPoints.goal_points} / {dailyPoints.total_points} points</p>
			<p class="text-blue-500 font-bold">
				{Math.floor((dailyPoints.total_points / dailyPoints.goal_points) * 100)}%
			</p>
		{/if}
	</div>
</Card.Header>
<Card.Content>
	<div class="flex flex-col gap-3 mt-10">
		<h1 class="text-xl font-bold">Quick Actions:</h1>
		<a href="/activity/create" class="text-blue-500 text-xl">Set an Activity</a>
	</div>
	<div class="flex flex-col gap-3 mt-10">
		<h1 class="text-xl font-bold">Quick Team Actions:</h1>
		<a href="/team/create" class="text-blue-500 text-xl">Create your productivity team</a>
	</div>
</Card.Content>
