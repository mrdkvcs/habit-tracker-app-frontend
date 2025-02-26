import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const loggedIn = event.cookies.get('token') != '' && event.cookies.get('token') != undefined;
	return {
		loggedIn
	};
};
