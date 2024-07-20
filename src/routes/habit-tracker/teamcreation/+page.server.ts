export const actions = {
	addTeam: async (event) => {
		const sessionId = event.cookies.get('sessionId');
		const formData = await event.request.formData();
		const team_name = formData.get('teamname') as string;
		const team_industry = formData.get('teamindustry') as string;
		const team_size = +formData.get('teamsize') as number;
		const is_private_string = formData.get('isPrivate') as string;
		const is_private: boolean = is_private_string === 'true';
		const response = await fetch('http://localhost:8080/teams', {
			method: 'POST',
			headers: {
				Authorization: `Apikey ${sessionId}`
			},
			body: JSON.stringify({ team_name, team_industry, team_size, is_private })
		});
		if (response.ok) {
			console.log('success');
			return {
				success: 'Team successfully created'
			};
		} else {
			console.log('error');
			const errorMessage = await response.json();
			return errorMessage;
		}
	}
};
