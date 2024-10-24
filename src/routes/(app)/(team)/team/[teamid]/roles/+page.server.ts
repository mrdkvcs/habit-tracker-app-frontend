import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ params, cookies }) => {
	const { teamid } = params;
	const sessionId = cookies.get('sessionId') as string;
	const ownershipResponse = await fetch(`http://localhost:8080/teams/${teamid}/ownership`, {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	if (!ownershipResponse.ok) {
		const errorMessage = await ownershipResponse.json();
		return errorMessage;
	}
	const ownership = await ownershipResponse.json();
	if (!ownership) {
		throw redirect(307, `/team/${teamid}`);
	}
	const response = await fetch(`http://localhost:8080/teams/${teamid}/roles?allroles=false`);
	if (!response.ok) {
		const errorMessage = await response.json();
		return errorMessage;
	}
	const teamRoles = await response.json();
	return {
		teamid,
		teamRoles
	};
};

export const actions = {
	addrole: async (event) => {
		const formData = await event.request.formData();
		const role_name = formData.get('rolename') as string;
		const team_id = formData.get('teamid') as string;
		const response = await fetch(`http://localhost:8080/teams/${team_id}/roles`, {
			method: 'POST',
			body: JSON.stringify({ role_name, team_id })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return errorMessage;
		}
		return {
			success: 'Role added successfully'
		};
	}
};
