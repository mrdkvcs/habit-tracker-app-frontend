import type { PageServerLoad } from './activities/$types';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('token');
	const user = event.locals.user;
	if (!user) {
		throw redirect(303, '/login');
	}
	return {
		user,
		token
	};
};
