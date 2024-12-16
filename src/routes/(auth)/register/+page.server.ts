import { redirect } from '@sveltejs/kit';
export const actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const email = formData.get('email');
		const set_default = formData.get('setDefault');
		const response = await fetch('http://localhost:8080/register', {
			method: 'POST',
			body: JSON.stringify({ username, password, email, set_default })
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
			sameSite: 'strict',
			secure: true,
			httpOnly: true,
			MaxAge: 60 * 60 * 24
		});
		throw redirect(303, '/dashboard');
	}
};
