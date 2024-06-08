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
	addactivity: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('activityname');
		const points = formData.get('activitypoints');
	}
};
