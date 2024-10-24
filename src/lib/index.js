// place files you want to import through the `$lib` alias in this folder.
import { writable } from 'svelte/store';

export const teamInfo = writable({
	team_name: '',
	team_industry: '',
	team_size: 0,
	is_private: false,
	owner: ''
});
