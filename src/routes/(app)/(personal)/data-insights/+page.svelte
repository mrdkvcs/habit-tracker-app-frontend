<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	let start_time: Date = $state(new Date());
	let end_time: Date = $state(new Date());
	let defaultperiod: boolean = $state(true);
	let productivityError: string = $state('');
	let { data } = $props();
	interface DailyProductivity {
		date: Date;
		total_points: number;
	}

	interface ProductivityStats {
		productivity_points: { total_points: number; average_points: number };
		best_productivity_day: DailyProductivity;
		productivity_days: DailyProductivity[];
	}
	let productivityStats: ProductivityStats = $state({
		productivity_points: { total_points: 0, average_points: 0 },
		best_productivity_day: { date: new Date(), total_points: 0 },
		productivity_days: []
	});
	function handleSelectChange(selectvalue: { value: string; label: string; disabled: boolean }) {
		let timePeriod = selectvalue.value;
		switch (timePeriod) {
			case 'last7Days':
				start_time = new Date();
				start_time.setDate(start_time.getDate() - 7);
				end_time = new Date();
				break;
			case 'last2Weeks':
				start_time = new Date();
				start_time.setDate(start_time.getDate() - 14);
				end_time = new Date();
				break;
			case 'lastMonth':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 1);
				end_time = new Date();
				break;
			case 'last3Months':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 3);
				end_time = new Date();
				break;
			case 'last6Months':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 6);
				end_time = new Date();
				break;
			case 'lastYear':
				start_time = new Date();
				start_time.setFullYear(start_time.getFullYear() - 1);
				end_time = new Date();
				break;
		}
	}
	async function handleSubmit(e: Event) {
		e.preventDefault();
		start_time = new Date(start_time);
		end_time = new Date(end_time);
		end_time.setDate(end_time.getDate() + 1);
		const response = await fetch('http://localhost:8080/productivitystats', {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${data.user.api_key}`
			},
			body: JSON.stringify({ start_time: start_time, end_time: end_time })
		});
		if (response.ok) {
			const productivityStatsResponse = await response.json();
			productivityStats = productivityStatsResponse;
			end_time.setDate(end_time.getDate() - 1);
		} else {
			const errorMessage = await response.json();
			productivityError = `Could not get productivity stats at the moment, Please try again later
error : ${errorMessage.error}
`;
		}
	}
</script>

<h1 class="text-2xl text-center font-bold mb-4">Data insights</h1>

{#if productivityError}
	<p>{productivityError}</p>
{/if}

{#if productivityStats}
	<h1 class="text-2xl font-bold text-center">Productivity stats</h1>
	<Card.Header>
		<div class="flex gap-2 items-center justify-center">
			<p class="text-lg text-gray-500">{start_time.toLocaleString()}</p>
			<p class="text-lg text-gray-500">-</p>
			<p class="text-lg text-gray-500">{end_time.toLocaleString()}</p>
		</div>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<h2 class="text-lg font-bold">Total productivity points over the time period:</h2>
					<p class="text-gray-500">{productivityStats.productivity_points.total_points}</p>
				</div>
				<div class="flex flex-col space-y-1.5">
					<h2 class="text-lg font-bold">Average productivity points over the time period:</h2>
					<p class="text-gray-500">{productivityStats.productivity_points.average_points}</p>
				</div>
				<div class="flex flex-col space-y-1.5">
					<h2 class="text-lg font-bold">Your best productivity day:</h2>
					<div class="flex gap-2">
						<p class="text-gray-500">
							{new Date(productivityStats.best_productivity_day.date).toISOString().split('T')[0]}
						</p>
						<p class="text-gray-500">
							{productivityStats.best_productivity_day.total_points} points
						</p>
					</div>
				</div>
				<div class="flex flex-col space-y-1.5">
					<h2 class="text-lg font-bold">Your productivity days:</h2>
					{#each productivityStats.productivity_days as productivityDay}
						<div class="flex gap-2">
							<p class="text-gray-500">
								{new Date(productivityDay.date).toISOString().split('T')[0]}
							</p>
							<p class="text-gray-500">{productivityDay.total_points} points</p>
						</div>
					{/each}
				</div>
			</div>
		</form>
	</Card.Content>
{:else if defaultperiod}
	<form onsubmit={handleSubmit} class="flex flex-col gap-2">
		<h2 class="text-lg font-bold text-center">
			Tell us in what period you want to see your productivity in
		</h2>
		<Button
			class="bg-white-500 text-blue-500 text-lg  mx-auto mt-5"
			on:click={() => (defaultperiod = false)}>Or set a custom one</Button
		>
		<Select.Root portal={null} onSelectedChange={(value) => handleSelectChange(value)}>
			<Select.Trigger class="w-[180px] mx-auto mt-5">
				<Select.Value placeholder="Select a time period" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Select a time period</Select.Label>
					<Select.Item value="last7Days">Last 7 days</Select.Item>
					<Select.Item value="last2Weeks">Last 2 weeks</Select.Item>
					<Select.Item value="lastMonth">Last month</Select.Item>
					<Select.Item value="last3Months">Last 3 months</Select.Item>
					<Select.Item value="last6Months">Last 6 months</Select.Item>
					<Select.Item value="lastYear">Last year</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Button type="submit" class="bg-blue-500 mx-auto mt-5">Give me the report</Button>
	</form>
{:else}
	<form onsubmit={handleSubmit} class="flex flex-col gap-2 justify-center">
		<h1 class="text-2xl font-bold text-center mb-5 text-blue-500">Set your custom time period</h1>
		<Button
			class="bg-white-500 text-blue-500 text-lg  mx-auto mt-2"
			on:click={() => (defaultperiod = true)}>Back to default</Button
		>
		<div class="flex gap-2 justify-center">
			<div class="flex flex-col gap-2">
				<p>Start time:</p>
				<input type="datetime-local" bind:value={start_time} />
			</div>
			<div class="flex flex-col gap-2">
				<p>End time:</p>
				<input type="datetime-local" bind:value={end_time} />
			</div>
		</div>
		<Button type="submit" class="bg-blue-500 mx-auto mt-10">Give me the report</Button>
	</form>
{/if}
