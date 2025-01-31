import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('token');
	const start_time = new Date();
	start_time.setDate(start_time.getDate() - 7);
	const end_time = new Date();
	const statsResponse = await fetch('http://localhost:8080/productivitystats', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ start_time, end_time })
	});
	if (statsResponse.ok) {
		const productivitystats = await statsResponse.json();
		if (productivitystats.length === 0) {
			const start_time = new Date();
			start_time.setDate(start_time.getMonth() - 1);
			const end_time = new Date();
			const statsResponse = await fetch('http://localhost:8080/productivitystats', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ start_time, end_time })
			});
			if (statsResponse.ok) {
				const productivitystats = await statsResponse.json();
				if (productivitystats.length === 0) {
					return {
						token,
						productivitystats: null
					};
				}
				const goalproductivitydays = productivitystats.productivity_days.filter(
					(day: { date: Date; total_points: number; status: string }) => day.status != 'no goal'
				);
				const completedproductivitydaysnumber = productivitystats.productivity_days.filter(
					(day: { date: Date; total_points: number; status: string }) => day.status == 'completed'
				).length;
				const goalproductivitydaysnumber = productivitystats.productivity_days.filter(
					(day: { date: Date; total_points: number; status: string }) => day.status != 'no goal'
				).length;
				const dateLabels = productivitystats.productivity_days.map(
					(productivityDay: { date: Date; total_points: number; status: string }) =>
						new Date(productivityDay.date).toISOString().split('T')[0]
				);
				const productivitypoints = productivitystats.productivity_days.map(
					(productivityDay: { date: Date; total_points: number; status: string }) =>
						productivityDay.total_points
				);
				return {
					token,
					productivitystats,
					goalproductivitydays,
					completedproductivitydaysnumber,
					goalproductivitydaysnumber,
					dateLabels,
					productivitypoints,
					timeperiod: 'Last month'
				};
			} else {
				return {
					token,
					productivitystats: null
				};
			}
		}
		const goalproductivitydays = productivitystats.productivity_days.filter(
			(day: { date: Date; total_points: number; status: string }) => day.status != 'no goal'
		);
		const completedproductivitydaysnumber = productivitystats.productivity_days.filter(
			(day: { date: Date; total_points: number; status: string }) => day.status == 'completed'
		).length;
		const goalproductivitydaysnumber = productivitystats.productivity_days.filter(
			(day: { date: Date; total_points: number; status: string }) => day.status != 'no goal'
		).length;
		const dateLabels = productivitystats.productivity_days.map(
			(productivityDay: { date: Date; total_points: number; status: string }) =>
				new Date(productivityDay.date).toISOString().split('T')[0]
		);
		const productivitypoints = productivitystats.productivity_days.map(
			(productivityDay: { date: Date; total_points: number; status: string }) =>
				productivityDay.total_points
		);
		return {
			token,
			productivitystats,
			goalproductivitydays,
			completedproductivitydaysnumber,
			goalproductivitydaysnumber,
			dateLabels,
			productivitypoints,
			timeperiod: 'Last 7 days'
		};
	} else {
		return {
			token,
			productivitystats: null
		};
	}
};
