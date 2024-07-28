import type { PageServerLoad } from '../$types';
export const load: PageServerLoad = async ({ params }) => {
	const { teamid } = params;
	const response = await fetch(`http:localhost:8080/teamactivities/${teamid}`);
	if (response.ok) {
		const teamactivities = await response.json();
		return {
			teamactivities
		};
	} else {
		const errorMessage = await response.json();
		return errorMessage;
	}
};
