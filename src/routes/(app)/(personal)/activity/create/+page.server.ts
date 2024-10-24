export const actions = {
	setSpecificActivity: async ({ request, cookies }) => {
		const sessionId = cookies.get('sessionId');
		const formData = await request.formData();
		const activity_id = formData.get('activity_id');
		const activity_name = formData.get('activity_name');
		const activity_duration = +formData.get('activity_duration');
		const activity_points = +formData.get('activity_points');
		const activity_description = formData.get('activity_description');
		const response = await fetch(`http://localhost:8080/activities/logs/specific`, {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${sessionId}`
			},
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
	}
};
