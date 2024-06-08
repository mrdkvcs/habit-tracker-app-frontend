import { redirect } from '@sveltejs/kit';
export const actions = {
	signout: async (event) => {
		event.cookies.set('sessionId', '', {
			path: '/'
		});
		throw redirect(303, '/login');
	}
};
