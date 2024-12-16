<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ProductivityChart from '$lib/components/ProductivityChart.svelte';
	let start_time: Date = $state(new Date());
	let end_time: Date = $state(new Date());
	let defaultperiod: boolean = $state(true);
	let productivityError: string = $state('');
	let goalProductivityDaysNumber: number = $state(0);
	let completedProductivityDaysNumber: number = $state(0);
	let productivityStats = $state();
	let productivityPoints: number[] = $state([]);
	let labels: Date[] = $state([]);

	interface ProductivityDay {
		date: Date;
		total_points: number;
		status: string;
	}

	let goalProductivityDays: ProductivityDay[] = $state([]);

	let { data } = $props();
	const { token } = data;

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
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ start_time: start_time, end_time: end_time })
		});

		if (response.ok) {
			const productivityStatsResponse = await response.json();
			if (productivityStatsResponse.length === 0) {
				productivityError = 'There are no data available in the defined time period ';
				return;
			}
			productivityStats = productivityStatsResponse;
			goalProductivityDays = productivityStatsResponse.productivity_days.filter(
				(day: { date: Date; total_points: number; status: string }) => day.status != 'no goal'
			);
			completedProductivityDaysNumber = productivityStatsResponse.productivity_days.filter(
				(day: { date: Date; total_points: number; status: string }) => day.status == 'completed'
			).length;
			goalProductivityDaysNumber = productivityStatsResponse.productivity_days.filter(
				(day: { date: Date; total_points: number; status: string }) => day.status != 'no goal'
			).length;
			labels = productivityStatsResponse.productivity_days.map(
				(productivityDay: { date: Date; total_points: number; status: string }) =>
					new Date(productivityDay.date).toISOString().split('T')[0]
			);
			productivityPoints = productivityStatsResponse.productivity_days.map(
				(productivityDay: { date: Date; total_points: number; status: string }) =>
					productivityDay.total_points
			);
			end_time.setDate(end_time.getDate() - 1);
		} else {
			const errorMessage = await response.json();
			productivityError = `Could not get productivity stats at the moment, Please try again later
error : ${errorMessage.error}
`;
		}
	}
</script>

{#if productivityError}
	<p class="text-center text-red-500 mb-5">{productivityError}</p>
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
	<ProductivityChart {labels} {productivityPoints} />
	<Card.Content class="mt-5">
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
					<h2 class="text-lg font-bold">As for your goals:</h2>
					{#if goalProductivityDaysNumber == 0}
						<h2 class="text-md text-gray-500">There were no goals set during this time period</h2>
					{/if}
					{#each goalProductivityDays as goalProductivityDay}
						<div class="flex gap-2">
							<p class="text-gray-500">
								{new Date(goalProductivityDay.date).toISOString().split('T')[0]}
							</p>
							<p class="text-gray-500">{goalProductivityDay.total_points} points</p>
							{#if goalProductivityDay.status === 'completed'}
								<p class="text-green-500">Goal achieved</p>
							{:else}
								<p class="text-red-500">Goal not achieved</p>
							{/if}
						</div>
					{/each}
				</div>
				{#if (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 > 60}
					<h2 class="text-lg font-bold text-green-500">
						You completed {(completedProductivityDaysNumber / goalProductivityDaysNumber) * 100}% of
						your goals in this time period
					</h2>
				{:else if (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 < 60 && (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 > 30}
					<h2 class="text-lg font-bold text-yellow-500">
						You completed {(completedProductivityDaysNumber / goalProductivityDaysNumber) * 100}% of
						your goals in this time period
					</h2>
				{:else if (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 > 0 && (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 < 30}
					<h2 class="text-lg font-bold text-red-500">
						You completed {Math.round(
							(completedProductivityDaysNumber / goalProductivityDaysNumber) * 100
						)}% of your goals in this time period
					</h2>
				{/if}
			</div>
		</form>
	</Card.Content>
{:else if defaultperiod}
	<h1 class="text-2xl text-center font-bold mb-4">Data insights</h1>
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
