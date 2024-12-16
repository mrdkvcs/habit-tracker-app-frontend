import { redirect } from '@sveltejs/kit';
export const actions = {
	login: async (event) => {
		const form = await event.request.formData();
		console.log(event.url);
		const email = form.get('email');
		const password = form.get('password');
		const redirectTo = form.get('redirectTo');
		const response = await fetch('http://localhost:8080/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});
		if (!response.ok) {
			const errorResponse = await response.json();
			return {
				error: errorResponse.error
			};
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
