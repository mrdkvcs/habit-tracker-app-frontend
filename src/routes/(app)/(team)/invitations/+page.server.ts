import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const sessionId = event.cookies.get('sessionId');
	const invitationsResponse = await fetch('http://localhost:8080/user/invitations', {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	if (!invitationsResponse.ok) {
		const errorMessage = await invitationsResponse.json();
		return errorMessage;
	}
	const teamInvites = await invitationsResponse.json();
	const seenResponse = await fetch('http://localhost:8080/user/invitations/seen', {
		method: 'UPDATE',
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	if (!seenResponse.ok) {
		return {
			error: 'Something went wrong. Please try again later'
		};
	}
	return { teamInvites };
};

export const actions = {
	acceptInvite: async (event) => {
		const formData = await event.request.formData();
		const sessionId = event.cookies.get('sessionId');
		const team_id = formData.get('teamId');
		const invitation_id = formData.get('inviteId');
		const response = await fetch('http://localhost:8080/user/invitations/accept', {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${sessionId}`
			},
			body: JSON.stringify({ team_id, invitation_id })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, errorMessage);
		}
		return {
			success: 'Team invitation accepted'
		};
	},
	declineInvite: async (event) => {
		const formData = await event.request.formData();
		const invitation_id = formData.get('inviteId');
		const response = await fetch(`http://localhost:8080/user/invitations/${invitation_id}`, {
			method: 'DELETE'
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, errorMessage);
		}
	}
};
