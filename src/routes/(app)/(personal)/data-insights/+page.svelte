<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ProductivityChart from '$lib/components/ProductivityChart.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	interface ProductivityStats {
		productivity_points: {
			total_points: number;
			average_points: number;
		};
		best_productivity_day: {
			date: Date;
			total_points: number;
		};
		productivity_days: ProductivityDay[];
		time: {
			productive_time: number;
			unproductive_time: number;
		};
	}

	let start_time: Date = $state(new Date());
	let end_time: Date = $state(new Date());
	let defaultperiod: boolean = $state(true);
	let goalProductivityDaysNumber: number = $state(0);
	let completedProductivityDaysNumber: number = $state(0);
	let productivityStats: ProductivityStats | null = $state(null);
	let productivityPoints: number[] = $state([]);
	let labels: Date[] = $state([]);
	let timePeriod: string | undefined = $state('');

	interface ProductivityDay {
		date: Date;
		total_points: number;
		status: string;
	}

	let goalProductivityDays: ProductivityDay[] = $state([]);

	let { data } = $props();

	const {
		token,
		productivitystats,
		goalproductivitydays,
		goalproductivitydaysnumber,
		completedproductivitydaysnumber,
		dateLabels,
		productivitypoints,
		timeperiod
	} = data;

	productivityStats = productivitystats;
	goalProductivityDays = goalproductivitydays;
	goalProductivityDaysNumber = goalproductivitydaysnumber;
	completedProductivityDaysNumber = completedproductivitydaysnumber;
	labels = dateLabels;
	productivityPoints = productivitypoints;
	timePeriod = timeperiod;

	async function getProductivityStats(start_time: Date, end_time: Date) {
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
				toast.push('There is no data available in the defined time period', {
					theme: {
						'--toastColor': 'white',
						'--toastBackground': '#FF0000',
						'--toastBarBackground': '#FF0000'
					}
				});
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
		} else {
			toast.push('Could not get productivity stats at the moment , please try again later', {
				theme: {
					'--toastColor': 'white',
					'--toastBackground': '#FF0000',
					'--toastBarBackground': '#FF0000'
				}
			});
		}
	}

	function handleSelectChange(selectvalue: { value: string; label: string; disabled: boolean }) {
		timePeriod = selectvalue.value;
		switch (timePeriod) {
			case 'Last 7 days':
				start_time = new Date();
				start_time.setDate(start_time.getDate() - 7);
				end_time = new Date();
				break;
			case 'Last 2 weeks':
				start_time = new Date();
				start_time.setDate(start_time.getDate() - 14);
				end_time = new Date();
				break;
			case 'Last month':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 1);
				end_time = new Date();
				break;
			case 'Last 3 months':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 3);
				end_time = new Date();
				break;
			case 'Last 6 months':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 6);
				end_time = new Date();
				break;
			case 'Last year':
				start_time = new Date();
				start_time.setFullYear(start_time.getFullYear() - 1);
				end_time = new Date();
				break;
		}
	}
	function handleTimePeriodChange(selectvalue: {
		value: string;
		label: string;
		disabled: boolean;
	}) {
		timePeriod = selectvalue.value;
		switch (timePeriod) {
			case 'Last 7 days':
				start_time = new Date();
				start_time.setDate(start_time.getDate() - 7);
				end_time = new Date();
				getProductivityStats(start_time, end_time);
				break;
			case 'Last 2 weeks':
				start_time = new Date();
				start_time.setDate(start_time.getDate() - 14);
				end_time = new Date();
				getProductivityStats(start_time, end_time);
				break;
			case 'Last month':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 1);
				end_time = new Date();
				getProductivityStats(start_time, end_time);
				break;
			case 'Last 3 months':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 3);
				end_time = new Date();
				getProductivityStats(start_time, end_time);
				break;
			case 'Last 6 months':
				start_time = new Date();
				start_time.setMonth(start_time.getMonth() - 6);
				end_time = new Date();
				getProductivityStats(start_time, end_time);
				break;
			case 'Last year':
				start_time = new Date();
				start_time.setFullYear(start_time.getFullYear() - 1);
				end_time = new Date();
				getProductivityStats(start_time, end_time);
				break;
		}
	}
	async function handleSubmit(e: Event) {
		e.preventDefault();
		start_time = new Date(start_time);
		end_time = new Date(end_time);
		end_time.setDate(end_time.getDate() + 1);
		getProductivityStats(start_time, end_time);
	}
</script>

{#if productivityStats}
	<Card.Header>
		<h1 class="text-2xl font-bold text-center mt-10">Your productivity stats</h1>
		<div class="flex gap-2 items-center justify-center"></div>
	</Card.Header>
	<Card.Content>
		<ProductivityChart {labels} {productivityPoints} />
		<Select.Root portal={null} onSelectedChange={(value) => handleTimePeriodChange(value)}>
			<Select.Trigger class="w-[180px] mt-5 ">
				<Select.Value placeholder={timeperiod} />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label></Select.Label>
					<Select.Item value="Last 7 days">Last 7 days</Select.Item>
					<Select.Item value="Last 2 weeks">Last 2 weeks</Select.Item>
					<Select.Item value="Last month">Last month</Select.Item>
					<Select.Item value="Last 3 months">Last 3 months</Select.Item>
					<Select.Item value="Last 6 months">Last 6 months</Select.Item>
					<Select.Item value="Last year">Last year</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<div class="mt-2">
			<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
				<div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
					<dt class="truncate text-xs font-bold text-gray-500">Total productivity points</dt>
					<dd class="mt-1 text-2xl font-semibold tracking-tight text-blue-500">
						{productivityStats.productivity_points.total_points}
					</dd>
				</div>
				<div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
					<dt class="truncate text-xs font-bold text-gray-500">Avg. productivity points/day</dt>
					<dd class="mt-1 text-2xl font-semibold tracking-tight text-blue-500">
						{productivityStats.productivity_points.average_points}
					</dd>
				</div>
				<div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
					<dt class="truncate text-xs font-bold text-gray-500">Best productivity day</dt>
					<dd class="mt-1 text-2xl font-semibold tracking-tight text-blue-500">
						{new Date(productivityStats.best_productivity_day.date).toISOString().split('T')[0]}
					</dd>
				</div>
			</dl>
			<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
				<div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
					<dt class="truncate text-sm font-bold text-gray-500">Time spent productive</dt>
					<dd class="mt-1 text-2xl font-semibold tracking-tight text-green-500">
						{Math.floor(productivityStats.time.productive_time / 60)} hour(s) {productivityStats
							.time.productive_time -
							Math.floor(productivityStats.time.productive_time / 60) * 60} minutes
					</dd>
				</div>
				<div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
					<dt class="truncate text-sm font-bold text-gray-500">Time spent unproductive</dt>
					<div class="flex gap-2">
						<dd class="mt-1 text-2xl font-semibold tracking-tight text-red-500">
							{Math.floor(productivityStats.time.unproductive_time / 60)} hour(s) {productivityStats
								.time.unproductive_time -
								Math.floor(productivityStats.time.unproductive_time / 60) * 60} minutes
						</dd>
					</div>
				</div>
			</dl>
		</div>
		<div class="flex flex-col space-y-1.5 mt-5">
			<h2 class="text-lg font-bold">As for the days you set goals:</h2>
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
			<h2 class="text-lg font-bold text-green-500 mt-5">
				You completed {Math.round(
					(completedProductivityDaysNumber / goalProductivityDaysNumber) * 100
				)}% of your goals in this time period
			</h2>
		{:else if (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 < 60 && (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 > 30}
			<h2 class="text-lg font-bold text-yellow-500 mt-5">
				You completed {Math.round(
					(completedProductivityDaysNumber / goalProductivityDaysNumber) * 100
				)}% of your goals in this time period
			</h2>
		{:else if (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 > 0 && (completedProductivityDaysNumber / goalProductivityDaysNumber) * 100 < 30}
			<h2 class="text-lg font-bold text-red-500 mt-5">
				You completed {Math.round(
					(completedProductivityDaysNumber / goalProductivityDaysNumber) * 100
				)}% of your goals in this time period
			</h2>
		{/if}
	</Card.Content>
{:else if defaultperiod}
	<h1 class="text-2xl text-center font-bold mb-4 mt-10">Data insights</h1>
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
					<Select.Item value="Last 7 days">Last 7 days</Select.Item>
					<Select.Item value="Last 2 weeks">Last 2 weeks</Select.Item>
					<Select.Item value="Last month">Last month</Select.Item>
					<Select.Item value="Last 3 months">Last 3 months</Select.Item>
					<Select.Item value="Last 6 months">Last 6 months</Select.Item>
					<Select.Item value="Last year">Last year</Select.Item>
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
