<script lang="ts">
	interface Form {
		error: string;
	}
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
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
<Card.Content class="mt-10">
	<h1 class="text-2xl font-bold mb-10">My daily activity list</h1>
	<div class="flow-root">
		<ul role="list" class="-mb-8">
			{#if dailyActivityLogs.length === 0}
				<h2 class="text-gray-500 text-center">You currently have no daily activity logs set</h2>
			{/if}
			{#each dailyActivityLogs as dailyActivityLog}
				<li>
					<div class="relative pb-8">
						{#if dailyActivityLogs.indexOf(dailyActivityLog) !== dailyActivityLogs.length - 1}
							<span class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"
							></span>
						{/if}
						<div class="relative flex items-center space-x-3">
							<div>
								{#if dailyActivityLog.points > 0}
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
								{:else}
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
								{/if}
							</div>
							<div class="flex min-w-0 flex-1 items-center space-x-4 pt-1.5">
								<div>
									<p class="text-md text-blue-500">
										{#if dailyActivityLog.name}
											{dailyActivityLog.name}
										{:else}
											One time activity
										{/if}
									</p>
								</div>
								<div>
									<p class="text-md text-gray-500">
										{Math.floor(dailyActivityLog.duration / 60)} hour(s) {dailyActivityLog.duration -
											Math.floor(dailyActivityLog.duration / 60) * 60} minutes
									</p>
								</div>
								<div>
									<p class="text-md text-gray-500">
										{dailyActivityLog.points} points
									</p>
								</div>
								<div class=" text-right text-sm text-gray-500">
									<p class="text-md text-gray-500">
										{dailyActivityLog.activity_description}
									</p>
								</div>
							</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</Card.Content>
