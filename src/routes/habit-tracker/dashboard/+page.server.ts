import { redirect } from '@sveltejs/kit';
export const actions = {
	signout: async (event) => {
		event.cookies.set('sessionId', '', {
			path: '/'
		});
		throw redirect(303, '/login');
	},
	addprodgoal: async (event) => {
		const sessionId = event.cookies.get('sessionId');
		const formData = await event.request.formData();
		const goal_points = +formData.get('goalpoints');
		const goal_date = new Date().toISOString();
		const response = await fetch('http://localhost:8080/productivitygoals', {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${sessionId}`
			},
			body: JSON.stringify({ goal_date, goal_points })
		});
		if (response.ok) {
			return {
				success: 'Productivity goal successfully added'
			};
		} else {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
	}
};
