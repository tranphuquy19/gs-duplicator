export const getGitlabScheduleIdFromUrl = (url: string): string => {
  const regex = /\/pipeline_schedules\/(\d+)/;
  const match = url?.match(regex);
  return match?.[1] || '';
};

export const isEditPipelineScheduleUrl = (url: string): boolean => {
  const regex = /\/pipeline_schedules\/(\d+)\/edit/;
  return regex.test(url || '');
};

export const isPipelineScheduleUrl = (url: string): boolean => {
  const regex = /\/pipeline_schedules$/;
  return regex.test(url || '');
};

export const getProjectFullPath = (url: string): string => {
  const regex = /\/(.*?)\/-\/pipeline_schedules/;
  const match = url.match(regex);
  return match?.[1] || '';
};

export const getOptionsFromVarDescription = (description: string): string[] => {
  const regex = /^\[(.*?)\]/;
  const match = description.match(regex);
  return match?.[1]?.split(',').map((value) => value.trim()) || [];
};
