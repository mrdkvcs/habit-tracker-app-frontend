export const load = async (event) => {
	const { teamid } = event.params;
	const sessionId = event.cookies.get('sessionId');
	return {
		teamid,
		sessionId
	};
};
