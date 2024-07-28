import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const teamid = params.teamid;
	const response = await fetch(`http://localhost:8080/teaminfo/${teamid}`);
	if (response.ok) {
		const team = await response.json();
		return {
			team
		};
	} else {
		const errorMessage = await response.json();
		return errorMessage;
	}
};
