import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils.ts';

export const handleFetch: HandleFetch = async ({ event, request }) => {
	request.headers.set('Accept', 'application/json');
	request.headers.set('Content-Type', 'application/json');

	if (event.cookies.get('token')) {
		request.headers.set('Authorization', `Bearer ${event.cookies.get('token')}`);
	}
	return fetch(request);
};

export function handleError({ error }) {
	console.error(error);
	return {
		message: 'Something went wrong. Please try again later.',
		code: '500'
	};
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	if (token) {
		const response = await event.fetch('http://localhost:8080/user');
		if (response.ok) {
			event.locals.user = await response.json();
		}
	}

	const routeId = event.route.id ?? '';

	if (event.locals.user && routeId.includes('/(auth)/') && routeId != '/(auth)/logout') {
		const redirectTo = event.url.searchParams.get('redirectTo');

		if (redirectTo) {
			throw redirect(302, `/${redirectTo.slice(1)}`);
		}

		throw redirect(303, '/dashboard');
	}

	if (!event.locals.user && routeId.includes('/(app)/')) {
		redirect(303, handleLoginRedirect(event));
	}
	return await resolve(event);
};
