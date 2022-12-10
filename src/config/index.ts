export const gitlabTokenLocalStorageKey = "gitlab_token";
export const gitlabUrl = document.location.origin;
export const gitlabApiUrl = `${gitlabUrl}/api/v4`;
export const gitlabProjectId = (<HTMLInputElement>document.querySelector("#project_id"))?.value;
export const gitlabToken = window.atob(localStorage.getItem(gitlabTokenLocalStorageKey) || "");
