import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

const schema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string()
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(schema));
	return {
		form
	};
};

export const actions = {
	login: async (event) => {
		const redirectTo = event.url.searchParams.get('redirectTo');
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await fetch('http://localhost:8080/login', {
			method: 'POST',
			body: JSON.stringify({ email: form.data.email, password: form.data.password })
		});
		if (!response.ok) {
			const errorResponse = await response.json();
			return setError(form, 'email', errorResponse.error);
		}
		const tokenResponse = await response.json();
		event.cookies.set('token', tokenResponse.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			MaxAge: 60 * 60 * 24
		});
		throw redirect(303, redirectTo);
	}
};
