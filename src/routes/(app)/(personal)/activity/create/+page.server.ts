import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('token');
	return {
		token
	};
};

export const actions = {
	setSpecificActivity: async (event) => {
		const formData = await event.request.formData();
		const activity_id = formData.get('activity_id');
		const activity_name = formData.get('activity_name');
		const activity_duration = +formData.get('activity_duration');
		const activity_points = +formData.get('activity_points');
		const activity_description = formData.get('activity_description');
		const response = await event.fetch(`http://localhost:8080/activities/logs/specific`, {
			method: 'POST',
			body: JSON.stringify({
				activity_id,
				activity_name,
				activity_points,
				activity_duration,
				activity_description
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
		return {
			success: 'Activity logged successfully'
		};
	},
	setNewActivity: async (event) => {
		const token = event.cookies.get('token');
		const formData = await event.request.formData();
		const activity_name: string = formData.get('activityName');
		const activity_points: number = +formData.get('activityPoints');
		const activity_duration: number = +formData.get('activityDuration');
		const activity_description: string = formData.get('activityDescription');
		const one_time: string = formData.get('oneTime');
		const response = await fetch('http://localhost:8080/activities/logs/new', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				activity_name,
				activity_points,
				activity_duration,
				activity_description,
				one_time
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
		return {
			success: 'New activity set successfully'
		};
	}
};
