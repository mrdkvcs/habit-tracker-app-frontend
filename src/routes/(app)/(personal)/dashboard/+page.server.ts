export const load = async (event) => {
	const dailyPointsResponse = await event.fetch('http://localhost:8080/dailypoints');
	if (!dailyPointsResponse.ok) {
		const errorResponse = await dailyPointsResponse.json();
		return {
			error: errorResponse.error
		};
	}
	const dailyPoints = await dailyPointsResponse.json();
	return {
		dailyPoints
	};
};
export const actions = {
	addprodgoal: async (event) => {
		const formData = await event.request.formData();
		const goal_points = +formData.get('goalpoints');
		const goal_date = new Date().toISOString();
		const response = await event.fetch('http://localhost:8080/productivitygoals', {
			method: 'POST',
			body: JSON.stringify({ goal_date, goal_points })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
		return {
			success: 'Productivity goal successfully added'
		};
	}
};
