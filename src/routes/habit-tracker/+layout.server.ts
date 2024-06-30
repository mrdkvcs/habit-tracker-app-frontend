import type { PageServerLoad } from '../login/$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const sessionId = event.cookies.get('sessionId');
	if (!sessionId) {
		throw redirect(303, '/register');
	}
	const userResponse = await fetch(`http://localhost:8080/user/${sessionId}`);
	const user = await userResponse.json();
	const activityPointsResponse = await fetch('http:localhost:8080/dailyactivitypoints', {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	const activityPoints = await activityPointsResponse.json();
	return {
		user,
		activityPoints
	};
};
