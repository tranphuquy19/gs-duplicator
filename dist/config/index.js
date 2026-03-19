"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveGitlabToolSettings = exports.saveGitlabToken = exports.replaceEnterWithN = exports.sortVarByName = exports.enableMarkdownVarDescription = exports.autoShowDropDown = exports.getTheOptionsFrom = exports.includeAllVariables = exports.wrappedVarBy = exports.gitlabDefaultPipelineSchedule = exports.gitlabRestPerPage = exports.gitlabSvgIconUrl = exports.gitlabToken = exports.gitlabProjectId = exports.gitlabGraphqlUrl = exports.gitlabApiUrl = exports.gitlabUrl = exports.gitlabTokenLocalStorageKey = void 0;
const gitlabTokenLocalStorageKey = 'gitlab_token';
exports.gitlabTokenLocalStorageKey = gitlabTokenLocalStorageKey;
const gitlabUrl = document.location.origin;
exports.gitlabUrl = gitlabUrl;
const gitlabApiUrl = `${gitlabUrl}/api/v4`;
exports.gitlabApiUrl = gitlabApiUrl;
const gitlabGraphqlUrl = `${gitlabUrl}/api/graphql`;
exports.gitlabGraphqlUrl = gitlabGraphqlUrl;
const gitlabProjectId = ((_a = document.querySelector('#project_id')) === null || _a === void 0 ? void 0 : _a.value) ||
    ((_b = document.querySelector('body')) === null || _b === void 0 ? void 0 : _b.getAttribute('data-project-id'));
exports.gitlabProjectId = gitlabProjectId;
const gitlabToken = window.atob(localStorage.getItem(gitlabTokenLocalStorageKey) || '');
exports.gitlabToken = gitlabToken;
let includeAllVariables = false;
exports.includeAllVariables = includeAllVariables;
let gitlabSvgIconUrl = `/assets/icons-29e9caf34d9cc5889ea5f1dce460a0578cd14318aabc385b1fe54ce6069c9874.svg`;
exports.gitlabSvgIconUrl = gitlabSvgIconUrl;
let gitlabRestPerPage = 9999; // Number of items per page for REST API
exports.gitlabRestPerPage = gitlabRestPerPage;
let gitlabDefaultPipelineSchedule = {
    active: false,
    cron: '0 15 * * *',
    description: 'New pipeline schedule',
    cron_timezone: 'UTC',
    ref: 'main',
};
exports.gitlabDefaultPipelineSchedule = gitlabDefaultPipelineSchedule;
let wrappedVarBy = '"';
exports.wrappedVarBy = wrappedVarBy;
let replaceEnterWithN = true;
exports.replaceEnterWithN = replaceEnterWithN;
let getTheOptionsFrom = 'merge_both'; // var_description, gitlab_variable_options, merge_both
exports.getTheOptionsFrom = getTheOptionsFrom;
let autoShowDropDown = true;
exports.autoShowDropDown = autoShowDropDown;
let enableMarkdownVarDescription = true;
exports.enableMarkdownVarDescription = enableMarkdownVarDescription;
let sortVarByName = true;
exports.sortVarByName = sortVarByName;
const gitlabToolSettingsLSKey = 'gitlab-tool-settings';
const gitlabToolSettings = localStorage.getItem(gitlabToolSettingsLSKey);
if (gitlabToolSettings === null) {
    localStorage.setItem(gitlabToolSettingsLSKey, JSON.stringify({
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
    }));
}
else {
    const settings = JSON.parse(gitlabToolSettings);
    exports.gitlabDefaultPipelineSchedule = gitlabDefaultPipelineSchedule = settings.gitlabDefaultPipelineSchedule;
    exports.wrappedVarBy = wrappedVarBy = settings.wrappedVarBy;
    exports.gitlabSvgIconUrl = gitlabSvgIconUrl = settings.gitlabSvgIconUrl;
    exports.gitlabRestPerPage = gitlabRestPerPage = settings.gitlabRestPerPage;
    exports.includeAllVariables = includeAllVariables = settings.includeAllVariables || false;
    exports.getTheOptionsFrom = getTheOptionsFrom = settings.getTheOptionsFrom || 'merge_both';
    exports.autoShowDropDown = autoShowDropDown = settings.autoShowDropDown || true;
    exports.enableMarkdownVarDescription = enableMarkdownVarDescription = settings.enableMarkdownVarDescription || true;
    exports.sortVarByName = sortVarByName = settings.sortVarByName || false;
    exports.replaceEnterWithN = replaceEnterWithN = settings.replaceEnterWithN || true;
}
const saveGitlabToken = (token) => {
    localStorage.setItem(gitlabTokenLocalStorageKey, window.btoa(token));
};
exports.saveGitlabToken = saveGitlabToken;
const saveGitlabToolSettings = (settings) => {
    const oldSettings = JSON.parse(localStorage.getItem(gitlabToolSettingsLSKey) || '');
    const newSettings = Object.assign(Object.assign({}, oldSettings), settings);
    localStorage.setItem(gitlabToolSettingsLSKey, JSON.stringify(newSettings));
};
exports.saveGitlabToolSettings = saveGitlabToolSettings;
exports.default = {
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
