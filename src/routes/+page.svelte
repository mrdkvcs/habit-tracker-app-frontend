<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const { loggedIn }: { loggedIn: boolean } = data;
</script>

<div class="bg-white">
	<header class="absolute inset-x-0 top-0 z-50">
		<nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
			<div class="flex lg:flex-1">
				<a href="#" class="-m-1.5 p-1.5">
					<span class="sr-only">Your Company</span>
					<div class="flex items-center gap-2">
						<h2 class="text-2xl font-bold">EaseFlow</h2>
						<img
							class="h-55 w-auto"
							src="https://tailwindui.com/plus/img/logos/mark.svg?color=blue&shade=500"
							alt=""
						/>
					</div>
				</a>
			</div>
		</nav>
	</header>

	<div class="relative isolate px-6 pt-14 lg:px-8">
		<div
			class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			aria-hidden="true"
		>
			<div
				class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-white opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
					Make every little effort count.
				</h1>
				<p class="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
					Track your activities effortlessly with AI that understands your custom tasks and
					calculates your productivity points. Set goals, analyze your progress, and see how
					productive you really are.
				</p>
				<p class="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
					It’s simple, personalized, and built to help you crush your goals. <strong
						class="font-bold">Ready to get started?</strong
					> Start now and be the best version of yourself.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					{#if loggedIn}
						<a
							href="/dashboard"
							class="rounded-md bg-blue-500 p-5 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>View your dashboard</a
						>
					{:else}
						<a
							href="/register"
							class="rounded-md bg-blue-500 p-5 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>Get started</a
						>
					{/if}
				</div>
			</div>
		</div>
		<div
			class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
			aria-hidden="true"
		>
			<div
				class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
	</div>
</div>
