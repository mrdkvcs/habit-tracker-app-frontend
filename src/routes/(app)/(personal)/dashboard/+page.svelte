<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import * as Dialog from '$lib/components/ui/dialog';
	import confetti from 'canvas-confetti';
	import { superForm } from 'sveltekit-superforms';
	let { data } = $props();
	const { form } = superForm(data.form);
	const { user, dailyStats } = data;
	onMount(() => {
		if (dailyStats.goal_points < dailyStats.total_points && dailyStats.goal_points != 0) {
			triggerCelebration();
		}
	});
	function triggerCelebration() {
		confetti({
			particleCount: 150,
			spread: 120,
			origin: { y: 0.5 }
		});
	}
</script>

<!-- Page header -->
<div class="bg-white shadow">
	<div class="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
		<div class="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
			<div class="min-w-0 flex-1">
				<!-- Profile -->
				<div class="flex items-center">
					<Icon icon="mdi:user" width="48" height="48" style="color: #2429bc" />
					<div>
						<div class="flex items-center">
							<h1 class="ml-3 text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-2xl/9">
								Welcome back , {user.username}
							</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-6 flex space-x-3 md:ml-4 md:mt-0">
				{#if dailyStats.goal_points == 0}
					<Dialog.Root>
						<Dialog.Trigger
							class="inline-flex items-center rounded-md bg-white-500 px-10 py-3 text-sm font-semibold text-blue-500 shadow-sm border border-gray-300  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
							>Set goal for today</Dialog.Trigger
						>
						<Dialog.Content class="sm:max-w-[425px]">
							<Dialog.Header>
								<Dialog.Title>Set productivity goal</Dialog.Title>
								<Dialog.Description
									>You can set your productivity goal for today here , and we will encourage you
									through email throughout the day if you allow us
								</Dialog.Description>
							</Dialog.Header>
							<form method="POST" action="?/addprodgoal">
								<div class="grid gap-4 py-4">
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="username" class="text-right">Points Goal</Label>
										<input
											id="points"
											name="points"
											required
											placeholder="(Min 30)"
											bind:value={$form.points}
											type="number"
											min="30"
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
				{/if}
				<a href="/activity/create">
					<button
						type="button"
						class="inline-flex items-center rounded-md bg-blue-500 px-10 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
						>Set an activity</button
					>
				</a>
			</div>
		</div>
	</div>
</div>

<div class="mt-8">
	<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
		{#if dailyStats.goal_points != 0 && dailyStats.total_points < dailyStats.goal_points}
			<div class="mb-5">
				<Progress
					value={dailyStats.total_points}
					max={dailyStats.goal_points}
					class="w-[60%] [&>div]:bg-blue-500 bg-gray-200 "
				/>
				<p class="font-medium mt-2">
					Productivity goal for today : {dailyStats.goal_points} / {dailyStats.total_points} points
				</p>
				<p class="text-blue-500 mt-2 font-bold">
					{Math.floor((dailyStats.total_points / dailyStats.goal_points) * 100)}%
				</p>
			</div>
		{:else if dailyStats.total_points >= dailyStats.goal_points && dailyStats.goal_points != 0}
			<h2 class="text-green-500 font-bold mb-5">
				Congrats! Productivity goal achieved for the day!
			</h2>
		{/if}
		{#if dailyStats.streak_message}
			<h2 class="font-bold text-lg text-gray-500">
				{dailyStats.streak_message}
			</h2>
		{/if}
		<div class="flex items-center justify-between">
			<h2 class="text-lg/6 font-medium text-gray-900">Today' s overview</h2>
			<div class="flex flex-col items-center mb-5 justify-center">
				<div class="flex gap-2 text-md">
					<h2 class="font-bold">Current streak 🔥:</h2>
					<p>{dailyStats.current_streak}</p>
				</div>
				<div class="flex gap-2 text-md">
					<h2 class="font-bold">Longest streak 🔥:</h2>
					<p>{dailyStats.longest_streak}</p>
				</div>
			</div>
		</div>
		<div class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Card -->
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-5">
					<div class="flex items-center">
						<div class="shrink-0">
							<svg
								class="size-6 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
								/>
							</svg>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="truncate mb-2 text-sm font-bold text-gray-500">
									Total productivity points
								</dt>
								<dd>
									<div class="text-lg font-medium text-gray-900">{dailyStats.total_points}</div>
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-5">
					<div class="flex items-center">
						<span
							class="flex size-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white"
						>
							<svg
								class="size-4 text-white"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="truncate mb-2 text-sm font-bold text-gray-500">Productive time</dt>
								<dd>
									{Math.floor(dailyStats.daily_productive_time.productive_time / 60)} hour(s) {dailyStats
										.daily_productive_time.productive_time -
										Math.floor(dailyStats.daily_productive_time.productive_time / 60) * 60} minutes
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-5">
					<div class="flex items-center">
						<span
							class="flex size-8 items-center justify-center rounded-full bg-red-500 ring-8 ring-white"
						>
							<svg
								class="size-4 text-white"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="truncate mb-2 text-sm font-bold text-gray-500">Unproductive time</dt>
								<dd>
									{Math.floor(dailyStats.daily_productive_time.unproductive_time / 60)} hour(s) {dailyStats
										.daily_productive_time.unproductive_time -
										Math.floor(dailyStats.daily_productive_time.unproductive_time / 60) * 60} minutes
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<!-- More items... -->
		</div>
	</div>

	<h2 class="mx-auto mt-8 max-w-6xl px-4 text-lg/6 font-medium mb-5 text-gray-900 sm:px-6 lg:px-8">
		Recent activities
	</h2>

	<!-- Activity list (smallest breakpoint only) -->
	<div class="shadow sm:hidden">
		<ul role="list" class="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
			<li>
				<a href="#" class="block bg-white px-4 py-4 hover:bg-gray-50">
					<span class="flex items-center space-x-4">
						<span class="flex flex-1 space-x-2 truncate">
							<svg
								class="size-5 shrink-0 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M1 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm12 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm13-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM1.75 14.5a.75.75 0 0 0 0 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 0 0-1.5 0v.784a.272.272 0 0 1-.35.25A49.043 49.043 0 0 0 1.75 14.5Z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="flex flex-col truncate text-sm text-gray-500">
								<span class="truncate">Payment to Molly Sanders</span>
								<span><span class="font-medium text-gray-900">$20,000</span> USD</span>
								<time datetime="2020-07-11">July 11, 2020</time>
							</span>
						</span>
						<svg
							class="size-5 shrink-0 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
				</a>
			</li>
		</ul>

		<nav
			class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
			aria-label="Pagination"
		>
			<div class="flex flex-1 justify-between">
				<a
					href="#"
					class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>Previous</a
				>
				<a
					href="#"
					class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>Next</a
				>
			</div>
		</nav>
	</div>

	<div class="hidden sm:block">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="mt-2 flex flex-col">
				{#if dailyStats.recent_activities.length === 0}
					<h2 class="text-gray-500 font-bold">
						Currently there are no recent activities logged , go on and make something productive!
					</h2>
				{:else}
					<div class="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
						<table class="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th
										class="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
										scope="col">Name</th
									>
									<th
										class="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
										scope="col">Points</th
									>
									<th
										class="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
										scope="col">Description</th
									>
								</tr>
							</thead>
							{#each dailyStats.recent_activities as recentActivity}
								<tbody class="divide-y divide-gray-200 bg-white">
									<tr class="bg-white">
										<td class="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
											<div class="flex">
												<a href="#" class="group inline-flex space-x-2 truncate text-sm">
													<p class="truncate text-gray-500 font-bold group-hover:text-gray-900">
														{#if recentActivity.name}
															{recentActivity.name}
														{:else}
															One time activity
														{/if}
													</p>
												</a>
											</div>
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
											{#if recentActivity.points > 0}
												<span class="font-medium text-green-500">
													{recentActivity.points}
												</span>
											{:else}
												<span class="font-medium text-red-500">
													{recentActivity.points}
												</span>
											{/if}
										</td>
										<td class="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
											{recentActivity.activity_description}
										</td>
									</tr>
								</tbody>
							{/each}
						</table>
					</div>
				{/if}
				{#if dailyStats.daily_activity_logs_count > 3 && dailyStats.recent_activities.length === 3}
					<div class="bg-gray-50 px-5 mt-2 py-3">
						<div class="text-sm">
							<a href="/activities/daily" class="font-medium text-cyan-700 hover:text-cyan-900"
								>View all</a
							>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
