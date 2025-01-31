<script>
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	let { data } = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form);
	const token = $page.url.searchParams.get('token');
</script>

<div class="min-h-full mt-24 justify-center py-12 sm:px-6 lg:px-8">
	<div class=" sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 class="mt-6 text-left text-2xl/9 font-bold tracking-tight text-gray-900">
					Reset Password
				</h2>
			</div>
			<form
				class="space-y-6 mt-5"
				use:enhance
				action={`?/resetPassword&token=${token}`}
				method="POST"
			>
				{#if $errors.newPassword}
					<p class="text-red-500 mb-2">{$errors.newPassword}</p>
				{/if}
				{#if $message}
					<div class="flex gap-2">
						<p class="text-green-500 mb-2">{$message}</p>
						<a class="text-blue-500" href="/login">Back to login page</a>
					</div>
				{/if}
				<div>
					<p class="text-xs mb-2 text-gray-500">
						Password must include one lowercase letter, one uppercase letter, one number, one
						special character
					</p>
					<label for="newPassword" class="block text-sm/6 font-medium text-gray-900"
						>New password</label
					>
					<div class="mt-2">
						<input
							id="newPassword"
							{...$constraints.newPassword}
							name="newPassword"
							type="password"
							bind:value={$form.newPassword}
							required
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
						/>
						<input id="token" name="token" type="hidden" value={token} />
					</div>
				</div>
				<Button type="submit" class="bg-blue-500 mt-10">Reset password</Button>
			</form>
		</div>
	</div>
</div>
