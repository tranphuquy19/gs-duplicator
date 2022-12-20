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

/**
 * Get project id from template variable string format '$glBranches(:project_id)'
 * @param varStr sample string: '$glBranches(41703858)'
 * @returns project id
 */
export const getProjectIdFromTemplateVar = (varStr: string): string => {
  const regex = /\$glBranches\((\d+)?\)/;
  const match = varStr.match(regex);
  return match?.[1] || '';
};
