export const gitlabTokenLocalStorageKey = 'gitlab_token';
export const gitlabUrl = document.location.origin;
export const gitlabApiUrl = `${gitlabUrl}/api/v4`;
export const gitlabGraphqlUrl = `${gitlabUrl}/api/graphql`;
export const gitlabProjectId = (<HTMLInputElement>document.querySelector('#project_id'))?.value;
export const gitlabToken = window.atob(localStorage.getItem(gitlabTokenLocalStorageKey) || '');
export const gitlabSvgIconUrl = `/assets/icons-29e9caf34d9cc5889ea5f1dce460a0578cd14318aabc385b1fe54ce6069c9874.svg`;
export const gitlabDefaultPipelineSchedule = {
  active: false,
  cron: '0 0 * * *',
  description: 'New pipeline schedule',
  cron_timezone: 'UTC',
  ref: 'main',
};
export const wrappedVarBy = localStorage.getItem('wrapped_var_by') || '"';
