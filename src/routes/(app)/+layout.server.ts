import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const sessionId = event.cookies.get('sessionId');

	if (!sessionId) {
		throw redirect(303, '/register');
	}
	const userResponse = await fetch(`http://localhost:8080/user/${sessionId}`);
	if (userResponse.ok) {
		const user = await userResponse.json();
		return {
			user
		};
	} else {
		return {
			error: 'Could not find user at the moment'
		};
	}
};
