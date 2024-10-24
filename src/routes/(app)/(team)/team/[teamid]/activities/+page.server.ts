import type { PageServerLoad } from '../$types';
export const load: PageServerLoad = async ({ params, cookies }) => {
	const { teamid } = params;
	const sessionId = cookies.get('sessionId');
	const response = await fetch(`http://localhost:8080/teams/${teamid}/user/activities`, {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	if (!response.ok) {
		const errorMessage = await response.json();
		console.log(errorMessage);
		return errorMessage;
	}
	const userTeamActivities = await response.json();
	return {
		userTeamActivities
	};
};
