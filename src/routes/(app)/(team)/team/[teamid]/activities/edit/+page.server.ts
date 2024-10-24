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
	try {
		const [teamActivitiesResponse, teamRolesResponse] = await Promise.all([
			fetch(`http://localhost:8080/teams/${teamid}/activities`),
			fetch(`http://localhost:8080/teams/${teamid}/roles?allroles=false`)
		]);
		if (!teamActivitiesResponse.ok) {
			const activitiesErrorMessage = await teamActivitiesResponse.json();
			return activitiesErrorMessage;
		}
		if (!teamRolesResponse.ok) {
			const rolesErrorMessage = await teamRolesResponse.json();
			return rolesErrorMessage;
		}
		const teamActivities = await teamActivitiesResponse.json();
		const teamRoles = await teamRolesResponse.json();
		return {
			teamid,
			teamActivities,
			teamRoles
		};
	} catch (e) {
		console.log(e);
	}
};

export const actions = {
	addTeamActivity: async (event) => {
		const formData = await event.request.formData();
		const { teamid } = event.params;
		const activity_name = formData.get('activityname') as string;
		const activity_points = +formData.get('activitypoints');
		const activity_roles = formData.get('teamroles') as string;
		const response = await fetch(`http://localhost:8080/teams/${teamid}/activities`, {
			method: 'POST',
			body: JSON.stringify({
				activity_name,
				activity_points,
				activity_roles: activity_roles.split(',')
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return errorMessage;
		}
		return {
			success: ' Team activity added successfully'
		};
	}
};
