import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

const schema = z.object({
	points: z.number().min(30, 'Goal points should be at least 30').max(240, 'Unrealistic goal set')
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(schema));
	const dailyStatsResponse = await event.fetch('http://localhost:8080/dailystats');
	if (!dailyStatsResponse.ok) {
		const errorResponse = await dailyStatsResponse.json();
		return {
			error: errorResponse.error
		};
	}
	const dailyStats = await dailyStatsResponse.json();
	return {
		dailyStats,
		form
	};
};
export const actions = {
	addprodgoal: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const goal_date = new Date().toISOString();
		const response = await event.fetch('http://localhost:8080/productivitygoals', {
			method: 'POST',
			body: JSON.stringify({ goal_date, goal_points: form.data.points })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return setError(form, 'points', errorMessage.error);
		}
		return {
			success: 'Productivity goal successfully added'
		};
	}
};
