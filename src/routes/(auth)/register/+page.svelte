<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { superForm } from 'sveltekit-superforms/client';
	let { data } = $props();
	const { form, errors, constraints, enhance } = superForm(data.form);
	let setDefault = $state(false);
</script>

<div class="flex min-h-full mt-12 flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="flex gap-5 items-center justify-center">
			<h2 class="text-3xl font-bold">EaseFlow</h2>
			<img
				class=" h-12 w-auto"
				src="https://tailwindui.com/plus/img/logos/mark.svg?color=blue&shade=500"
				alt="Your Company"
			/>
		</div>
		<h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
			Create your account, and be the best version of yourself with us!
		</h2>
	</div>

	<div class=" sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<form class="space-y-6" action="?/register" use:enhance method="POST">
				<div>
					{#if $errors.email}
						<p class="text-red-500 mb-2">{$errors.email}</p>
					{/if}
					<label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
					<div class="mt-2">
						<input
							id="email"
							bind:value={$form.email}
							name="email"
							type="email"
							autocomplete="email"
							{...$constraints.email}
							required
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					{#if $errors.username}
						<p class="text-red-500">{$errors.username}></p>
					{/if}
					<label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
					<div class="mt-2">
						<input
							id="username"
							name="username"
							bind:value={$form.username}
							type="text"
							{...$constraints.username}
							required
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
						/>
					</div>
				</div>
				{#if $errors.password}
					<p class="text-red-500">{$errors.password}></p>
				{/if}
				<div>
					<label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
					<p class="text-xs text-gray-500">
						Password must include one lowercase letter, one uppercase letter, one number, one
						special character
					</p>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							bind:value={$form.password}
							autocomplete="current-password"
							{...$constraints.password}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
						/>
					</div>
				</div>
				<div class="flex items-center gap-5">
					<Switch id="defaultactivities" bind:checked={setDefault} />
					<Label for="defaultactivities"
						>Include 10 default activities (eg : Learning , Exercise , Watching series...)</Label
					>
				</div>
				<input type="hidden" name="setDefault" bind:value={setDefault} />
				<div>
					<button
						type="submit"
						class="flex w-full mt-8 justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>Create my account</button
					>
				</div>
			</form>

			<div>
				<div class="relative mt-10">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-gray-200"></div>
					</div>
					<div class="relative flex justify-center text-sm/6 font-medium">
						<span class="bg-white px-6 text-gray-900">Or sign up with</span>
					</div>
				</div>

				<div class="mt-6">
					<a
						href="http://localhost:5173/google/auth/login"
						class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
								fill="#EA4335"
							/>
							<path
								d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
								fill="#4285F4"
							/>
							<path
								d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
								fill="#FBBC05"
							/>
							<path
								d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
								fill="#34A853"
							/>
						</svg>
						<span class="text-sm/6 font-semibold">Google</span>
					</a>
				</div>
			</div>
		</div>

		<p class="mt-10 text-center text-sm/6 text-gray-500">
			Already have an account?
			<a href="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">Log in</a>
		</p>
	</div>
</div>
