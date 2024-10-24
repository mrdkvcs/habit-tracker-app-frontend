import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const teamid = params.teamid;
	const sessionId = cookies.get('sessionId');
	const [teamResponse, ownerShipResponse] = await Promise.all([
		fetch(`http://localhost:8080/teams/${teamid}`),
		fetch(`http://localhost:8080/teams/${teamid}/ownership`, {
			headers: {
				Authorization: `Apikey ${sessionId}`
			}
		})
	]);
	if (!teamResponse.ok) {
		const errorMessage = await teamResponse.json();
		return {
			error: errorMessage.error
		};
	}
	if (!ownerShipResponse.ok) {
		const errorMessage = await ownerShipResponse.json();
		return {
			error: errorMessage.error
		};
	}
	const team = await teamResponse.json();
	const ownership = await ownerShipResponse.json();
	return {
		team,
		ownership
	};
};
