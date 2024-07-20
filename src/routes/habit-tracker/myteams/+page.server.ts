import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const sessionId = event.cookies.get('sessionId');
	const response = await fetch('http://localhost:8080/teams', {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	if (response.ok) {
		const userTeams = await response.json();
		return {
			userTeams
		};
	} else {
		const errorMessage = await response.json();
		return errorMessage;
	}
};
