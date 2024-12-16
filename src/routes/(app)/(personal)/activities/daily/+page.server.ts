import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const response = await event.fetch('http://localhost:8080/activities/daily/logs');
	if (!response.ok) {
		const errorMessage = await response.json();
		return fail(400, {
			error: errorMessage.error
		});
	}
	const dailyActivityLogs = await response.json();
	return {
		dailyActivityLogs
	};
};
