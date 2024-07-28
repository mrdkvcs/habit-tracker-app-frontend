import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const sessionId = event.cookies.get('sessionId');
	const activitiesResponse = await fetch('http://localhost:8080/activities', {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	const activities = await activitiesResponse.json();
	return {
		activities
	};
};

export const actions = {
	addactivity: async ({ request, cookies }) => {
		const sessionId = cookies.get('sessionId');
		const formData = await request.formData();
		const name = formData.get('activityname');
		const activitypoints = formData.get('activitypoints');
		const points = +activitypoints;
		const response = await fetch('http://localhost:8080/activities', {
			method: 'POST',
			body: JSON.stringify({ name, points }),
			headers: {
				Authorization: `Apikey ${sessionId}`
			}
		});
		if (response.ok) {
			return {
				success: 'Activity added successfully'
			};
		} else {
			const errorMessage = await response.json();
			return fail(400, {
				error: errorMessage.error
			});
		}
	},
	removeactivity: async ({ request }) => {
		const formData = await request.formData();
		const activityId = formData.get('activityid');
		const response = await fetch(`http://localhost:8080/activities/${activityId}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			const responseText = await response.json();
			console.log(responseText);
			return {
				success: responseText
			};
		} else {
			const errorMessage = await response.json();
			console.log(errorMessage);
			return fail(400, {
				error: errorMessage.error
			});
		}
	}
};
