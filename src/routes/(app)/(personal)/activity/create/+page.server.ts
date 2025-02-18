import { fail } from '@sveltejs/kit';

export const actions = {
	setActivityLog: async (event) => {
		const formData = await event.request.formData();
		const activity_input = formData.get('activityInput');
		const response = await event.fetch('http://localhost:8080/activities/logs', {
			method: 'POST',
			body: JSON.stringify({ activity_input })
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, { error: errorMessage.error });
		}
		const matchedActivitiesResponse = await response.json();
		if (matchedActivitiesResponse.matched_activities) {
			if (matchedActivitiesResponse.matched_activities.length === 1) {
				if (matchedActivitiesResponse.streak_count && matchedActivitiesResponse.is_streak_record) {
					return {
						matchedActivitieslength: 1,
						streakCount: matchedActivitiesResponse.streak_count,
						isStreakRecord: matchedActivitiesResponse.is_streak_record
					};
				}
				return {
					matchedActivitieslength: 1
				};
			} else if (matchedActivitiesResponse.matched_activities.length > 1) {
				return {
					matchedActivitieslength: matchedActivitiesResponse.matched_activities.length,
					matchedActivitiesResponse
				};
			} else {
				return {
					matchedActivitieslength: 0,
					matchedActivitiesResponse
				};
			}
		} else if (matchedActivitiesResponse.activity_logs) {
			const multipleActivitiesMatch = matchedActivitiesResponse.activity_logs.filter(
				(activityLog) => activityLog.matched_activities.length > 1
			);
			const noActivitiesMatch = matchedActivitiesResponse.activity_logs.filter(
				(activityLog) => activityLog.matched_activities.length === 0
			);
			if (matchedActivitiesResponse.streak_count && matchedActivitiesResponse.is_streak_record) {
				return {
					multipleActivitiesMatch,
					noActivitiesMatch,
					multipleLoggedActivities: true,
					streakCount: matchedActivitiesResponse.streak_count,
					isStreakRecord: matchedActivitiesResponse.is_streak_record
				};
			} else if (matchedActivitiesResponse.streak_count) {
				return {
					multipleActivitiesMatch,
					noActivitiesMatch,
					multipleLoggedActivities: true,
					streakCount: matchedActivitiesResponse.streak_count
				};
			}
			return {
				multipleActivitiesMatch,
				noActivitiesMatch,
				multipleLoggedActivities: true
			};
		}
	},
	setSpecificActivityLog: async (event) => {
		const formData = await event.request.formData();
		const activity_id = formData.get('activity_id') as string;
		const activity_name = formData.get('activity_name') as string;
		const activity_points = formData.get('activity_points') as string;
		const activity_duration = formData.get('activity_duration') as string;
		const activity_description = formData.get('activity_description') as string;
		const response = await event.fetch(`http://localhost:8080/activities/logs/specific`, {
			method: 'POST',
			body: JSON.stringify({
				activity_id,
				activity_name,
				activity_points: +activity_points,
				activity_duration: +activity_duration,
				activity_description
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, { error: errorMessage.error });
		}
		const setSpecificActivityLogResponse = await response.json();
		if (
			setSpecificActivityLogResponse.streak_count &&
			setSpecificActivityLogResponse.is_streak_record
		) {
			return {
				streakCount: setSpecificActivityLogResponse.streak_count,
				isStreakRecord: setSpecificActivityLogResponse.is_streak_record
			};
		}
		return {
			success: true
		};
	},
	setNewActivityLog: async (event) => {
		const formData = await event.request.formData();
		const activity_name = formData.get('activityName') as string;
		const activity_points = formData.get('activityPoints') as string;
		const activity_duration = formData.get('activityDuration') as string;
		const activity_description = formData.get('activityDescription') as string;
		const one_time = formData.get('oneTime') as string;
		const response = await event.fetch(`http://localhost:8080/activities/logs/new`, {
			method: 'POST',
			body: JSON.stringify({
				activity_name,
				activity_points: +activity_points,
				activity_duration: +activity_duration,
				activity_description,
				one_time
			})
		});
		if (!response.ok) {
			const errorMessage = await response.json();
			return fail(400, { error: errorMessage.error });
		}
		const setNewActivityLogResponse = await response.json();
		if (setNewActivityLogResponse.streak_count && setNewActivityLogResponse.is_streak_record) {
			return {
				streakCount: setNewActivityLogResponse.streak_count,
				isStreakRecord: setNewActivityLogResponse.is_streak_record
			};
		}
		return {
			success: true
		};
	}
};
