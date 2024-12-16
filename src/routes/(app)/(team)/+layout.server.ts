import type { PageServerLoad } from '../../$types';

export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('token');

	const userResponse = await fetch('http://localhost:8080/user', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	const user = await userResponse.json();

	return {
		user
	};
};
