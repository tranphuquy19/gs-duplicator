import { GitlabToolSettings } from '@/types';

const gitlabTokenLocalStorageKey = 'gitlab_token';
const gitlabUrl = document.location.origin;
const gitlabApiUrl = `${gitlabUrl}/api/v4`;
const gitlabGraphqlUrl = `${gitlabUrl}/api/graphql`;
const gitlabProjectId =
  (<HTMLInputElement>document.querySelector('#project_id'))?.value ||
  document.querySelector('body')?.getAttribute('data-project-id');
const gitlabToken = window.atob(localStorage.getItem(gitlabTokenLocalStorageKey) || '');

let includeAllVariables = false;
let gitlabSvgIconUrl = `/assets/icons-29e9caf34d9cc5889ea5f1dce460a0578cd14318aabc385b1fe54ce6069c9874.svg`;
let gitlabRestPerPage = 9999; // Number of items per page for REST API
let gitlabDefaultPipelineSchedule = {
  active: false,
  cron: '0 15 * * *',
  description: 'New pipeline schedule',
  cron_timezone: 'UTC',
  ref: 'main',
};
let wrappedVarBy = '"';
let replaceEnterWithN = true;
let getTheOptionsFrom = 'var_description';
let autoShowDropDown = true;
let enableMarkdownVarDescription = true;
let sortVarByName = true;

const gitlabToolSettingsLSKey = 'gitlab-tool-settings';
const gitlabToolSettings = localStorage.getItem(gitlabToolSettingsLSKey);
if (gitlabToolSettings === null) {
  localStorage.setItem(
    gitlabToolSettingsLSKey,
    JSON.stringify({
      gitlabDefaultPipelineSchedule,
      wrappedVarBy,
      gitlabSvgIconUrl,
      gitlabRestPerPage,
      includeAllVariables,
      getTheOptionsFrom,
      autoShowDropDown,
      enableMarkdownVarDescription,
      sortVarByName,
      replaceEnterWithN,
    } as GitlabToolSettings)
  );
} else {
  const settings = JSON.parse(gitlabToolSettings) as GitlabToolSettings;
  gitlabDefaultPipelineSchedule = settings.gitlabDefaultPipelineSchedule;
  wrappedVarBy = settings.wrappedVarBy;
  gitlabSvgIconUrl = settings.gitlabSvgIconUrl;
  gitlabRestPerPage = settings.gitlabRestPerPage;
  includeAllVariables = settings.includeAllVariables;
  getTheOptionsFrom = settings.getTheOptionsFrom;
  autoShowDropDown = settings.autoShowDropDown;
  enableMarkdownVarDescription = settings.enableMarkdownVarDescription;
  sortVarByName = settings.sortVarByName;
  replaceEnterWithN = settings.replaceEnterWithN;
}

const saveGitlabToken = (token: string) => {
  localStorage.setItem(gitlabTokenLocalStorageKey, window.btoa(token));
};

const saveGitlabToolSettings = (settings: Partial<GitlabToolSettings>) => {
  const oldSettings = JSON.parse(localStorage.getItem(gitlabToolSettingsLSKey) || '');
  const newSettings = {
    ...oldSettings,
    ...settings,
  };
  localStorage.setItem(gitlabToolSettingsLSKey, JSON.stringify(newSettings));
};

export {
  gitlabTokenLocalStorageKey,
  gitlabUrl,
  gitlabApiUrl,
  gitlabGraphqlUrl,
  gitlabProjectId,
  gitlabToken,
  gitlabSvgIconUrl,
  gitlabRestPerPage,
  gitlabDefaultPipelineSchedule,
  wrappedVarBy,
  includeAllVariables,
  getTheOptionsFrom,
  autoShowDropDown,
  enableMarkdownVarDescription,
  sortVarByName,
  replaceEnterWithN,
  saveGitlabToken,
  saveGitlabToolSettings,
};
