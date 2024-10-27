<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let username: string = $state('');
	let errorMessage: string = $state('');
	let successMessage: string = $state('');
	interface User {
		id: string;
		username: string;
		has_been_invited: boolean;
		inviteToggled: boolean;
	}
	let searchedUsers: User[] = $state([]);
	const { user, teamid, sessionId } = data;
	async function handleUserSearch() {
		if (username.trim().length > 0) {
			const response = await fetch(
				`http://localhost:8080/users?q=${encodeURIComponent(username)}&teamid=${teamid}&userid=${user.id}`
			);
			if (response.ok) {
				searchedUsers = await response.json();
				searchedUsers = searchedUsers.map((user) => {
					if (!user.has_been_invited) {
						return { ...user, inviteToggled: false };
					} else {
						return user;
					}
				});
			} else {
				errorMessage = 'Error getting users';
			}
		} else {
			searchedUsers = [];
		}
	}
	async function inviteUser(recipient_id: string) {
		const response = await fetch(`http://localhost:8080/teams/${teamid}/invitation`, {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${sessionId}`
			},
			body: JSON.stringify({ recipient_id, sender_id: user.id })
		});
		if (!response.ok) {
			errorMessage = 'Error inviting user';
			return;
		}
		successMessage = 'Invitation sent successfully';
		searchedUsers = searchedUsers.map((user) => {
			if (user.id === recipient_id) {
				return { ...user, inviteToggled: true };
			} else {
				return user;
			}
		});
	}
</script>

{#if errorMessage}
	<p class="text-red-500 text-center mb-5">{errorMessage}</p>
{/if}
{#if successMessage}
	<p class="text-green-500 text-center mb-5">{successMessage}</p>
{/if}
<div class="flex justify-center items-center">
	<input
		class="w-96 text-center text-lg border-blue-500 border-2 rounded-md"
		type="text"
		oninput={handleUserSearch}
		bind:value={username}
		placeholder="Search users..."
	/>
</div>
<div class="flex flex-col gap-2 mt-5">
	{#each searchedUsers as searchedUser}
		<form
			onsubmit={preventDefault(() => inviteUser(searchedUser.id))}
			class="flex items-center justify-center gap-2"
		>
			<h2 class="text-blue-500 text-center font-bold">{searchedUser.username}</h2>
			{#if searchedUser.has_been_invited || searchedUser.inviteToggled}
				<p class="text-gray-500">invite already sent</p>
			{:else}
				<button type="submit">
					<Icon icon="mdi:invite" width="24" height="24" style="color: green" />
				</button>
			{/if}
		</form>
	{/each}
</div>
