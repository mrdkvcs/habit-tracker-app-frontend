import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const sessionId = event.cookies.get('sessionId');
	const response = await fetch('http://localhost:8080/activities/daily/logs', {
		headers: {
			Authorization: `Apikey ${sessionId}`
		}
	});
	if (response.ok) {
		const dailyActivityLogs = await response.json();
		return {
			dailyActivityLogs
		};
	} else {
		const errorMessage = await response.json();
		console.log(errorMessage);
		return fail(400, {
			error: errorMessage.error
		});
	}
};
