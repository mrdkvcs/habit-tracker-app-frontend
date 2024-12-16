import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
	event.cookies.set('token', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		maxAge: 0
	});
	throw redirect(303, '/login');
};
