import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const response = await event.fetch('http://localhost:8080/suggestFeature');
	if (!response.ok) {
		const errorMessage = await response.json();
		return {
			error: errorMessage.error
		};
	}
	const suggestedFeatures = await response.json();
	return {
		suggestedFeatures
	};
};

export const actions = {
	suggestFeature: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const response = await event.fetch('http://localhost:8080/suggestFeature', {
			method: 'POST',
			body: JSON.stringify({ title, description })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return {
				error: errorMessage.error
			};
		}
		const successMessage = await response.json();
		return {
			success: successMessage
		};
	}
};
