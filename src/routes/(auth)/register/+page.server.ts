import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError } from 'sveltekit-superforms';
import type { PageServerLoad } from '../../(app)/(team)/team/[teamid]/activities/edit/$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const schema = z.object({
	email: z.string().email(),
	username: z
		.string()
		.min(3, 'Username is too short.It needs to be at least 4 characters long. ')
		.max(15, 'Username is too long It needs to be at most 15 characters long. '),
	password: z
		.string()
		.min(8, 'Password is too short.It needs to be at least 8 characters long. ')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		),
	setDefault: z.string()
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(schema));
	return {
		form
	};
};

export const actions = {
	register: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await fetch('http://localhost:8080/register', {
			method: 'POST',
			body: JSON.stringify({
				username: form.data.username,
				password: form.data.password,
				email: form.data.email,
				setDefault: form.data.setDefault
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return setError(form, 'email', errorMessage.error);
		}
		const tokenResponse = await response.json();
		event.cookies.set('token', tokenResponse.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			MaxAge: 60 * 60 * 24
		});
		throw redirect(303, '/dashboard');
	}
};
