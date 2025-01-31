import { fail } from '@sveltejs/kit';

export const actions = {
	setActivityLog: async (event) => {
		const formData = await event.request.formData();
		const activity_input = formData.get('activityInput');
		const response = await event.fetch('http://localhost:8080/activities/logs', {
			method: 'POST',
			body: JSON.stringify({ activity_input })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, { error: errorMessage.error });
		}
		const matchedActivitiesResponse = await response.json();
		if (matchedActivitiesResponse.matched_activities.length === 1) {
			return {
				matchedActivitieslength: 1
			};
		} else if (matchedActivitiesResponse.matched_activities.length > 1) {
			return {
				matchedActivitieslength: matchedActivitiesResponse.matched_activities.length,
				matchedActivitiesResponse
			};
		} else {
			return {
				matchedActivitieslength: 0,
				matchedActivitiesResponse
			};
		}
	},
	setSpecificActivityLog: async (event) => {
		const formData = await event.request.formData();
		const activity_id = formData.get('activity_id') as string;
		const activity_name = formData.get('activity_name') as string;
		const activity_points = formData.get('activity_points') as string;
		const activity_duration = formData.get('activity_duration') as string;
		const activity_description = formData.get('activity_description') as string;
		const response = await event.fetch(`http://localhost:8080/activities/logs/specific`, {
			method: 'POST',
			body: JSON.stringify({
				activity_id,
				activity_name,
				activity_points: +activity_points,
				activity_duration: +activity_duration,
				activity_description
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, { error: errorMessage.error });
		}
		return {
			success: true
		};
	},
	setNewActivityLog: async (event) => {
		const formData = await event.request.formData();
		const activity_name = formData.get('activityName') as string;
		const activity_points = formData.get('activityPoints') as string;
		const activity_duration = formData.get('activityDuration') as string;
		const activity_description = formData.get('activityDescription') as string;
		const one_time = formData.get('oneTime') as string;
		const response = await event.fetch(`http://localhost:8080/activities/logs/new`, {
			method: 'POST',
			body: JSON.stringify({
				activity_name,
				activity_points: +activity_points,
				activity_duration: +activity_duration,
				activity_description,
				one_time
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, { error: errorMessage.error });
		}
		return {
			success: true
		};
	}
};
