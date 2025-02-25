import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError } from 'sveltekit-superforms';

const schema = z.object({
	activityName: z.string(),
	activityPoints: z
		.number()
		.min(-10, "Can't set activity points below 10")
		.max(10, "Can't set activity points above 10")
});
interface Activity {
	activity_id: string;
	name: string;
	points: number;
	type: string;
}

export const load: PageServerLoad = async (event) => {
	let formedActivities = [];
	const token = event.cookies.get('token');
	const form = await superValidate(zod(schema));
	const activitiesResponse = await event.fetch('http://localhost:8080/activities');
	const activities = await activitiesResponse.json();
	formedActivities = activities.map((activity: Activity) => {
		return { ...activity, optionsopen: false };
	});
	return {
		formedActivities,
		token,
		form
	};
};

export const actions = {
	addActivity: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await event.fetch('http://localhost:8080/activities', {
			method: 'POST',
			body: JSON.stringify({ name: form.data.activityName, points: form.data.activityPoints })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return setError(form, 'activityName', errorMessage.error);
		}
		const addedActivity = await response.json();
		return {
			activityId: addedActivity.activity_id,
			activityName: form.data.activityName,
			activityPoints: form.data.activityPoints,
			activityType: addedActivity.type
		};
	},

	editActivity: async ({ request }) => {
		const formData = await request.formData();
		const activity_name = formData.get('activityname') as string;
		const activity_points = +formData.get('activitypoints');
		const activity_id = formData.get('activityid') as string;
		const response = await fetch(`http://localhost:8080/activities/${activity_id}`, {
			method: 'PUT',
			body: JSON.stringify({ activity_name, activity_points })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
		return {
			activity_name,
			activity_points,
			activity_id
		};
	}
};
