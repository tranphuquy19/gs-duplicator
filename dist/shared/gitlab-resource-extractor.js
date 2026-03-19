"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectIdFromTemplateVar = exports.getScheduleIdFromUrl = exports.getScheduleIdFromGid = exports.getOptionsFromVarDescription = exports.getProjectFullPath = exports.isPipelineScheduleUrl = exports.isEditPipelineScheduleUrl = exports.getGitlabScheduleIdFromUrl = void 0;
const getGitlabScheduleIdFromUrl = (url) => {
    const regex = /\/pipeline_schedules\/(\d+)/;
    const match = url === null || url === void 0 ? void 0 : url.match(regex);
    return (match === null || match === void 0 ? void 0 : match[1]) || '';
};
exports.getGitlabScheduleIdFromUrl = getGitlabScheduleIdFromUrl;
const isEditPipelineScheduleUrl = (url) => {
    const regex = /\/pipeline_schedules\/(\d+)\/edit/;
    return regex.test(url || '');
};
exports.isEditPipelineScheduleUrl = isEditPipelineScheduleUrl;
const isPipelineScheduleUrl = (url) => {
    const regex = /\/pipeline_schedules$/;
    return regex.test(url || '');
};
exports.isPipelineScheduleUrl = isPipelineScheduleUrl;
const getProjectFullPath = (url) => {
    const regex = /\/(.*?)\/-\/pipeline_schedules/;
    const match = url.match(regex);
    return (match === null || match === void 0 ? void 0 : match[1]) || '';
};
exports.getProjectFullPath = getProjectFullPath;
const getOptionsFromVarDescription = (description) => {
    var _a;
    const regex = /^\[(.*?)\]/;
    const match = description.match(regex);
    return ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.split(',').map((value) => value.trim())) || [];
};
exports.getOptionsFromVarDescription = getOptionsFromVarDescription;
const getScheduleIdFromGid = (gid) => {
    //gid://gitlab/Ci::PipelineSchedule/<six_digits>
    const regex = /\/(\d+)$/;
    const match = gid.match(regex);
    return (match === null || match === void 0 ? void 0 : match[1]) || '';
};
exports.getScheduleIdFromGid = getScheduleIdFromGid;
const getScheduleIdFromUrl = (url) => {
    //https://gitlab.com/<project_path>/-/pipeline_schedules/<schedule_id>/edit?id=<schedule_id>
    const regex = /\/pipeline_schedules\/(\d+)/;
    const match = url.match(regex);
    return (match === null || match === void 0 ? void 0 : match[1]) || '';
};
exports.getScheduleIdFromUrl = getScheduleIdFromUrl;
/**
 * Get project id from template variable string format '$glBranches(:project_id)'
 * @param varStr sample string: '$glBranches(41703858)'
 * @returns project id
 */
const getProjectIdFromTemplateVar = (varStr) => {
    const regex = /\$glBranches\((\d+)?\)/;
    const match = varStr.match(regex);
    return (match === null || match === void 0 ? void 0 : match[1]) || '';
};
exports.getProjectIdFromTemplateVar = getProjectIdFromTemplateVar;
