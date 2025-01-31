import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError, message } from 'sveltekit-superforms';
import type { PageServerLoad } from '../../(app)/(team)/team/[teamid]/activities/edit/$types';
import { fail } from '@sveltejs/kit';
const schema = z.object({
	email: z.string().email('Invalid email format')
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(schema));
	return {
		form
	};
};
export const actions = {
	forgotPassword: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await fetch('http://localhost:8080/forgot-password', {
			method: 'POST',
			body: JSON.stringify({ email: form.data.email })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return setError(form, 'email', errorMessage.error);
		}
		return message(form, 'Email sent successfully');
	}
};
