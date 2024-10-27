<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { enhance } from '$app/forms';
	let { form } = $props();
	let industry: string = $state();
	let isPrivate: boolean = $state();
	const industries = [
		{ value: 'finance', label: 'Finance' },
		{ value: 'tech', label: 'Tech' },
		{ value: 'marketing', label: 'Marketing' },
		{ value: 'Healthcare', label: 'Healthcare' },
		{ value: 'Education', label: 'Education' },
		{ value: 'other', label: 'Other' }
	];
	function handleSelectChange(industryvalue: { value: string; label: string; disabled: boolean }) {
		industry = industryvalue.value;
	}
</script>

<Card.Header>
	<Card.Title class="text-4xl">Team Creation</Card.Title>
</Card.Header>
{#if form}
	{#if form.error}
		<p class="text-red-500 text-center mb-6">{form.error}</p>
	{/if}
	{#if form.success}
		<div class="flex flex-col gap-2">
			<p class="text-green-500 text-center">{form.success}</p>
			<a class="text-blue-500 text-center underline" href="/teams"
				>You can view your teams at the My Teams section</a
			>
		</div>
	{/if}
{/if}
<Card.Content>
	<form method="POST" action="?/addTeam " use:enhance>
		<div class="grid w-full items-center gap-4">
			<div class="flex flex-col space-y-1.5 mb-5">
				<Label for="name">Name of the team</Label>
				<Input id="teamname" name="teamname" placeholder="Enter your team`s name" />
			</div>
			<div class="flex flex-col space-y-1.5">
				<Label for="name">Industry of the team (optional)</Label>
				<Select.Root portal={null} onSelectedChange={(value) => handleSelectChange(value)}>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="Select an industry" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Industries</Select.Label>
							{#each industries as industry}
								<Select.Item value={industry.value} label={industry.label}
									>{industry.label}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="teamindustry" />
				</Select.Root>
				{#if industry === 'other'}
					<Input
						class="my-5"
						id="industry"
						name="industry"
						placeholder="Enter your team's industry or mission"
					/>
				{/if}
			</div>
			<input type="hidden" name="teamindustry" bind:value={industry} />
			<div class="flex flex-col my-5 space-y-1.5 mb-5">
				<Label for="name">Number of members</Label>
				<Input
					id="teamsize"
					type="number"
					min="2"
					max="10"
					name="teamsize"
					placeholder="Enter your team size (min 2 , max 10)"
				/>
			</div>
			<div class="flex items-center space-x-2 space-y-1.5">
				<Switch bind:checked={isPrivate} id="private-team" />
				<Label for="private-team">Private Team</Label>
			</div>
			<input type="hidden" name="isPrivate" bind:value={isPrivate} />
			<p class="text-gray-500 mb-5">
				If you choose your team to be private , others will not be able to search for your team only
				you can invite them
			</p>
		</div>
		<div class="flex flex-col">
			<Button type="submit" class="mx-auto">Create your team</Button>
		</div>
	</form>
</Card.Content>
