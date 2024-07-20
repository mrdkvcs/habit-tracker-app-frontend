import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const sessionId = event.cookies.get('sessionId');

	const response = await fetch('http://localhost:8080/activities', {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});

	if (response.ok) {
		const activities = await response.json();
		return {
			activities
		};
	} else {
		const error = await response.json();
		return fail(400, {
			error
		});
	}
};

export const actions = {
	setActivity: async (event) => {
		const sessionId = event.cookies.get('sessionId');
		const formData = await event.request.formData();
		const activity_id = formData.get('activityId');
		const points = +formData.get('activityPoints');
		const start_time = new Date(formData.get('startTime')).toISOString();
		const end_time = new Date(formData.get('endTime')).toISOString();
		if (new Date(formData.get('startTime')) > new Date(formData.get('endTime'))) {
			return fail(400, {
				error: 'Start time must be before end time'
			});
		}
		const response = await fetch('http://localhost:8080/activitieslog', {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${sessionId}`
			},
			body: JSON.stringify({ activity_id, start_time, end_time, points })
		});
		if (response.ok) {
			return {
				success: 'Activity logged successfully'
			};
		} else {
			const logError = await response.json();
			return fail(400, {
				error: logError.error
			});
		}
	}
};
