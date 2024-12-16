import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
	const state = event.cookies.get('oauth_state');
	const returnedState = event.url.searchParams.get('state');
	const code = event.url.searchParams.get('code');
	if (state !== returnedState) {
		throw redirect(302, '/login?error=invalid_state');
	}
	const response = await fetch('http://localhost:8080/google/auth/callback', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ code })
	});
	if (!response.ok) {
		throw redirect(302, '/login?error=oauth_failed');
	}
	const tokenResponse = await response.json();
	event.cookies.set('token', tokenResponse.token, {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: 60 * 24
	});
	throw redirect(302, '/dashboard');
};
