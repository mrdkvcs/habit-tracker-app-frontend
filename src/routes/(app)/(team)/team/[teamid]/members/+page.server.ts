import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const { teamid } = params;
	const sessionId = cookies.get('sessionId') as string;
	const membersResponse = await fetch(`http://localhost:8080/teams/${teamid}/members`, {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	if (!membersResponse.ok) {
		const errorMessage = await membersResponse.json();
		return {
			error: errorMessage.error
		};
	}
	const members = await membersResponse.json();
	return {
		members,
		teamid
	};
};

export const actions = {
	setMemberRoles: async ({ request, params }) => {
		const { teamid } = params;
		const formData = await request.formData();
		const selected_roles = formData.get('selectedRoles') as string;
		const team_membership_id = formData.get('teamMembershipId') as string;
		const response = await fetch(
			`http://localhost:8080/teams/${teamid}/roles/${team_membership_id}`,
			{
				method: 'POST',
				body: JSON.stringify({ selected_roles: selected_roles.split(',') })
			}
		);
		if (!response.ok) {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
		return {
			success: 'User roles added successfully'
		};
	}
};
