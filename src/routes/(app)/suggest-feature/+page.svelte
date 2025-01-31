<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	interface SuggestedFeature {
		id: string;
		title: string;
		description: string;
		username: string;
		user_id: string;
		upvote: number;
		upvoted: boolean;
	}

	let clientSuggestedFeatures: SuggestedFeature[] = $state([]);
	let title: string = $state('');
	let description: string = $state('');
	let errorMessage: string = $state('');

	function getUpVotedFeatures() {
		let upvotedFeatures = localStorage.getItem('upvotedFeatures');
		return upvotedFeatures ? JSON.parse(upvotedFeatures) : [];
	}

	async function updateSuggestedFeatureUpvote(id: string, upvoted: boolean) {
		let upvotedFeatures = getUpVotedFeatures();
		if (upvoted) {
			const response = await fetch(`http://localhost:8080/suggestFeature/downvote/${id}`, {
				method: 'PUT'
			});
			if (!response.ok) {
				let errorResponse = await response.json();
				errorMessage = errorResponse.error;
				return;
			}
			upvotedFeatures = upvotedFeatures.filter((feature: string) => feature !== id);
			clientSuggestedFeatures = clientSuggestedFeatures.map(
				(clientSuggestedFeature: SuggestedFeature) => {
					if (clientSuggestedFeature.id === id) {
						return {
							...clientSuggestedFeature,
							upvoted: false,
							upvote: clientSuggestedFeature.upvote - 1
						};
					}
					return clientSuggestedFeature;
				}
			);
		} else {
			const response = await fetch(`http://localhost:8080/suggestFeature/upvote/${id}`, {
				method: 'PUT'
			});
			if (!response.ok) {
				let errorResponse = await response.json();
				errorMessage = errorResponse.error;
				return;
			}
			upvotedFeatures.push(id);
			clientSuggestedFeatures = clientSuggestedFeatures.map(
				(clientSuggestedFeature: SuggestedFeature) => {
					if (clientSuggestedFeature.id === id) {
						return {
							...clientSuggestedFeature,
							upvoted: true,
							upvote: clientSuggestedFeature.upvote + 1
						};
					}
					return clientSuggestedFeature;
				}
			);
		}
		localStorage.setItem('upvotedFeatures', JSON.stringify(upvotedFeatures));
	}

	let { form, data } = $props();
	const { suggestedFeatures } = data;

	if (typeof localStorage !== 'undefined') {
		const upvotedFeatures = getUpVotedFeatures();
		clientSuggestedFeatures = suggestedFeatures.map((suggestedFeature: SuggestedFeature) => {
			if (upvotedFeatures.includes(suggestedFeature.id)) {
				return { ...suggestedFeature, upvoted: true };
			} else {
				return { ...suggestedFeature, upvoted: false };
			}
		});
	}
</script>

{#if form}
	{#if form.success}
		<div class="flex justify-center">
			<h2 class=" text-2xl absolute top-28 font-bold text-green-500">
				{form.success}
			</h2>
		</div>
	{/if}
{/if}

<div class="flex gap-5">
	<Card.Root class="w-[550px]  mt-5  mx-auto absolute left-1/4 top-40 ">
		{#if form}
			{#if form.error}
				<h2 class="text-red-500 text-center">{form.error}</h2>
			{/if}
		{/if}
		<Card.Header class="flex flex-col gap-4">
			<h2 class=" text-2xl font-bold text-left text-blue-500">Suggest a feature</h2>
		</Card.Header>
		<Card.Content>
			<form method="POST" action="?/suggestFeature">
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Feature description title</Label>
					<Input id="title" bind:value={title} name="title" placeholder="Enter title" />
				</div>
				<div class="flex flex-col space-y-1.5 mt-8">
					<Label for="description">Description</Label>
					<Textarea bind:value={description} placeholder="Enter description" name="description" />
				</div>
				<div class="flex justify-center">
					<Button type="submit" class="bg-blue-500  p-6 mt-8">Suggest feature</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
	<div class="flex flex-col gap-2 absolute right-20 top-40">
		{#each [...clientSuggestedFeatures].sort((a, b) => b.upvote - a.upvote) as clientSuggestedFeature}
			<Card.Root class="w-[550px] mt-5">
				{#if form}
					{#if form.error}
						<h2 class="text-red-500 text-center">{form.error}</h2>
					{/if}
				{/if}
				<Card.Header class="flex flex-col gap-4">
					<div class="flex gap-2 items-center">
						<h2 class=" text-lg font-bold text-left text-blue-500">
							{clientSuggestedFeature.title}
						</h2>
						<p class=" text-sm text-gray-500">{clientSuggestedFeature.username}</p>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="flex justify-between">
						<p class="text-gray-500 w-[80%] break-words whitespace-normal">
							{clientSuggestedFeature.description}
						</p>
						<Button
							on:click={() =>
								updateSuggestedFeatureUpvote(
									clientSuggestedFeature.id,
									clientSuggestedFeature.upvoted
								)}
							class=" flex gap-2 bg-blue-500"
						>
							<Icon icon="bx:upvote" />
							{clientSuggestedFeature.upvote}
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
