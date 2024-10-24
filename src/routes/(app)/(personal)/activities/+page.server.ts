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
	editActivity: async ({ request }) => {
		const formData = await request.formData();
		const activity_name = formData.get('activityname') as string;
		const activity_points = +formData.get('activitypoints');
		const activity_id = formData.get('activityid') as string;
		const response = await fetch(`http://localhost:8080/activities/${activity_id}`, {
			method: 'PUT',
			body: JSON.stringify({ activity_name, activity_points })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
		return {
			success: 'Activity edited successfully'
		};
	}
};
