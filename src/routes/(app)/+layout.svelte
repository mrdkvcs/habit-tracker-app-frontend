<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	let { data, children } = $props();
	let openUserMenu = $state(false);
	let notificationCount: number = $state(0);
	const { user } = data;
	const socket = new WebSocket(`http://localhost:8080/ws?userid=${user.id}`);
	onMount(() => {
		getNotificationCount();
	});
	async function getNotificationCount() {
		try {
			const response = await fetch('http://localhost:8080/user/invitations/count', {
				headers: {
					Authorization: `Apikey ${user.api_key}`
				}
			});
			if (response.ok) {
				notificationCount = await response.json();
			}
		} catch (e) {
			console.error(`Network error ${e}`);
		}
	}
	socket.onmessage = (event) => {
		if (event.data === 'Invite received') {
			notificationCount += 1;
		}
	};
	socket.onclose = () => {
		console.log('Connection closed');
	};
	socket.onopen = () => {
		console.log('Connection established');
	};
</script>

<div>
	<!-- Static sidebar for desktop -->
	<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<!-- Sidebar component, swap this element with another sidebar if you like -->
		<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-500 px-6 pb-4">
			<div class="flex h-16 shrink-0 items-center">
				<h2 class="text-white font-bold text-xl mt-5">EaseFlow - The Ultimate Habit Tracker</h2>
			</div>
			<nav class="flex flex-1 flex-col mt-5">
				<ul role="list" class="flex flex-1 flex-col gap-y-7">
					<li>
						<ul role="list" class="-mx-2 space-y-4">
							<li>
								<a
									href="/dashboard"
									class="group flex gap-x-3 rounded-md hover:bg-blue-400 p-2 text-md font-semibold leading-6 text-white hover:text-white"
								>
									<Icon icon="fa6-solid:house" width="26" height="26" style="color: white" />
									Dashboard
								</a>
							</li>
							<li>
								<a
									href="/activity/create"
									class="group flex gap-x-3 rounded-md p-2 text-md font-semibold leading-6 text-white hover:bg-blue-400 hover:text-white"
								>
									<Icon icon="ic:baseline-plus" width="26" height="26" style="color: white" />
									Set Activity
								</a>
							</li>
							<li>
								<a
									href="/activities"
									class="group flex gap-x-3 rounded-md p-2 text-md font-semibold leading-6 text-white hover:bg-blue-400 hover:text-white"
								>
									<Icon icon="material-symbols:list" width="26" height="26" style="color: white" />
									My Activity List
								</a>
							</li>
							<li>
								<a
									href="/activities/daily"
									class="group flex gap-x-3 rounded-md p-2 text-md-sm font-semibold leading-6 text-white hover:bg-blue-400 hover:text-white"
								>
									<Icon icon="material-symbols:list" width="26" height="26" style="color: white" />
									Daily Activity List
								</a>
							</li>
							<li>
								<a
									href="/data-insights"
									class="group flex gap-x-3 rounded-md p-2 text-md font-semibold leading-6 text-white hover:bg-blue-400 hover:text-white"
								>
									<Icon
										icon="fluent:data-area-24-filled"
										width="26"
										height="26"
										style="color: white"
									/>
									Data Insights
								</a>
							</li>
							<li>
								<a
									href="/suggest-feature"
									class="group flex gap-x-3 rounded-md p-2 text-md font-semibold leading-6 text-white hover:bg-blue-400 hover:text-white"
								>
									<Icon width="26" height="26" icon="material-symbols:help" />
									Suggest a feature
								</a>
							</li>
						</ul>
					</li>
					<li class="mt-auto">
						<a
							href="#"
							class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
						>
							<svg
								class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Settings
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>

	<div class="lg:pl-72">
		<div
			class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
		>
			<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
				<span class="sr-only">Open sidebar</span>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>

			<!-- Separator -->
			<div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>

			<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
				<form class="relative flex flex-1" action="#" method="GET">
					<label for="search-field" class="sr-only">Search</label>
					<svg
						class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
							clip-rule="evenodd"
						/>
					</svg>
					<input
						id="search-field"
						class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
						placeholder="Search..."
						type="search"
						name="search"
					/>
				</form>
				<div class="flex items-center gap-x-4 lg:gap-x-6">
					<button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
						<span class="sr-only">View notifications</span>
						<svg
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
							/>
						</svg>
					</button>

					<!-- Separator -->
					<div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true"></div>

					<!-- Profile dropdown -->
					<div class="relative">
						<button
							type="button"
							onclick={() => {
								openUserMenu = !openUserMenu;
							}}
							class="-m-1.5 flex items-center p-1.5"
							id="user-menu-button"
							aria-expanded="false"
							aria-haspopup="true"
						>
							<span class="sr-only">Open user menu</span>
							<Icon icon="mdi:user" width="24" height="24" style="color: #2429bc" />
							<span class="hidden lg:flex lg:items-center">
								<span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true"
									>{user.username}</span
								>
								<svg
									class="ml-2 h-5 w-5 text-gray-400"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
						</button>

						<!--
              Dropdown menu, show/hide based on menu state.

              Entering: "transition ease-out duration-100"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            -->
						{#if openUserMenu}
							<div
								class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu-button"
								tabindex="-1"
							>
								<div class="flex items-center justify-center">
									<a href="/logout" class="bg-blue-500">
										<Button class="bg-blue-500">Sign out</Button>
									</a>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<main class="py-10">
			<div class=" mt-24 px-4 sm:px-6 lg:px-8">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
