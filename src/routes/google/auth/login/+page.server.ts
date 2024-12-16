import type { PageServerLoad } from './$types';
import { OAUTH_GOOGLE_CLIENT_ID } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
	const state = crypto.randomUUID();
	event.cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		maxAge: 300
	});
	throw redirect(
		302,
		`https://accounts.google.com/o/oauth2/auth?client_id=${OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalho
st%3A5173%2Fgoogle%2Fauth%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth
%2Fuserinfo.profile&state=${state}`
	);
};
