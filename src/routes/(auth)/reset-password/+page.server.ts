import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError, message } from 'sveltekit-superforms';
import type { PageServerLoad } from '../../(app)/(team)/team/[teamid]/activities/edit/$types';
import { fail } from '@sveltejs/kit';

const schema = z.object({
	newPassword: z
		.string()
		.min(8, 'Password is too short.It needs to be at least 8 characters long. ')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		)
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event.request, zod(schema));
	return {
		form
	};
};

export const actions = {
	resetPassword: async (event) => {
		const token = event.url.searchParams.get('token');
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await fetch('http://localhost:8080/reset-password', {
			method: 'POST',
			body: JSON.stringify({ newPassword: form.data.newPassword, token })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return setError(form, 'newPassword', errorMessage.error);
		}
		return message(form, 'Password reset went successfully!');
	}
};
