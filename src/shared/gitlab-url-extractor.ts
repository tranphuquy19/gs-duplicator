export const getGitlabScheduleIdFromUrl = (url?: string): string | undefined => {
	const regex = /\/pipeline_schedules\/(\d+)/;
	const match = url?.match(regex);
	return match ? match[1] : "";
};
