import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('token');
	const activitiesResponse = await event.fetch('http://localhost:8080/activities');
	const activities = await activitiesResponse.json();
	return {
		activities,
		token
	};
};

export const actions = {
	addactivity: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('activityname');
		const activitypoints = formData.get('activitypoints');
		const points = +activitypoints;
		const response = await event.fetch('http://localhost:8080/activities', {
			method: 'POST',
			body: JSON.stringify({ name, points })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, {
				error: errorMessage.error
			});
		}
		return {
			success: 'Activity added successfully'
		};
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
