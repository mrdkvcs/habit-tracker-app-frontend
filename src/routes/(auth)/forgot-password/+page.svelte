<script>
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	let { data } = $props();
	let { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<div class="min-h-full mt-24 justify-center py-12 sm:px-6 lg:px-8">
	<div class=" sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 class="mt-6 text-left text-2xl/9 font-bold tracking-tight text-gray-900">
					Forgot Password
				</h2>
				<p class="text-gray-500 mt-2">
					Enter your email and you will receive a link where you can reset your password via email
				</p>
			</div>
			<form class="space-y-6 mt-5" action="?/forgotPassword" use:enhance method="POST">
				<div>
					{#if $errors.email}
						<p class="text-red-500 mb-2">{$errors.email}</p>
					{/if}
					{#if $message}
						<p class="text-green-500 mb-2">{$message}</p>
					{/if}
					<label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							bind:value={$form.email}
							autocomplete="email"
							required
							{...$constraints.email}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
						/>
					</div>
				</div>
				<Button type="submit" class="bg-blue-500">Reset password</Button>
			</form>
		</div>
	</div>
</div>
