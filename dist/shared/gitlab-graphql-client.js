"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabGraphqlClient = void 0;
const axios_1 = require("axios");
const config_1 = require("@/config");
const types_1 = require("@/types");
const get_gl_token_1 = require("./get-gl-token");
const gitlab_graphql_query_1 = require("./gitlab-graphql.query");
const gitlab_resource_extractor_1 = require("./gitlab-resource-extractor");
const http_client_base_1 = require("./http-client-base");
class GitlabGraphqlClient extends http_client_base_1.HttpClient {
    constructor(_token) {
        super(config_1.gitlabGraphqlUrl);
        this._token = _token;
        this.RETRIES = 5;
        this._handleRequest = (config) => {
            if (!!config && !!config.headers) {
                config.headers['Authorization'] = `Bearer ${this._token}`;
            }
            return config;
        };
        this._handleUnauthorizedError = (error) => {
            var _a;
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                this._token = (0, get_gl_token_1.getGitlabToken)();
            }
        };
        this._initInterceptor = () => {
            this.client.interceptors.request.use(this._handleRequest, this._handleError);
        };
        this._init();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new GitlabGraphqlClient();
        }
        return this.instance;
    }
    getCiConfigVariables(projectUrl, ref) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let ciConfigVariables = [];
            let retries = 0;
            try {
                let isBreak = false;
                while (!isBreak && retries < this.RETRIES) {
                    const { data: glGetCiConfigVarRes } = yield this.client.post('', {
                        operationName: 'ciConfigVariables',
                        query: gitlab_graphql_query_1.getCiConfigVariablesQueryStr,
                        variables: {
                            fullPath: projectUrl,
                            ref,
                        },
                    });
                    if (((_a = glGetCiConfigVarRes === null || glGetCiConfigVarRes === void 0 ? void 0 : glGetCiConfigVarRes.project) === null || _a === void 0 ? void 0 : _a.ciConfigVariables) !== null &&
                        !!glGetCiConfigVarRes &&
                        ((_c = (_b = glGetCiConfigVarRes === null || glGetCiConfigVarRes === void 0 ? void 0 : glGetCiConfigVarRes.project) === null || _b === void 0 ? void 0 : _b.ciConfigVariables) === null || _c === void 0 ? void 0 : _c.length) != 0) {
                        ciConfigVariables = glGetCiConfigVarRes.project.ciConfigVariables;
                        isBreak = true;
                    }
                    retries++;
                }
                return ciConfigVariables
                    ? ciConfigVariables
                        .filter((variable) => variable.description !== null)
                        .map((variable) => ({
                        key: variable.key,
                        value: variable.value,
                        description: variable.description,
                        variable_type: types_1.GitlabScheduleVariableTypes.ENV_VAR,
                        valueOptions: variable.valueOptions,
                    }))
                    : [];
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    /**
     * Get Gitlab pipeline schedules by ids
     * @param projectPath
     * @param ids - let null to get all schedules
     * @returns
     */
    getPipelineSchedulesQuery(projectPath, ids = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.client.post('', {
                operationName: 'getPipelineSchedulesQuery',
                query: gitlab_graphql_query_1.getPipelineSchedulesQueryStr,
                variables: {
                    ids: ids,
                    projectPath,
                    first: 50,
                    last: null,
                    nextPageCursor: '',
                    prevPageCursor: '',
                    sortValue: 'DESCRIPTION_DESC',
                },
            });
            return data;
        });
    }
    getPipelineScheduleIdsQuery(projectPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.getPipelineSchedulesQuery(projectPath);
            return GitlabGraphqlClient.getPipelineScheduleIdsQueryFromPipelineScheduleDataArray(res);
        });
    }
    static getPipelineScheduleIdsQueryFromPipelineScheduleDataArray(data) {
        var _a, _b, _c;
        return (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.project) === null || _a === void 0 ? void 0 : _a.pipelineSchedules) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.map((node) => {
            return (0, gitlab_resource_extractor_1.getScheduleIdFromGid)(node.id);
        });
    }
    updatePipelineSchedule(pipelineScheduleId, projectPath, updatedPipelineSchedule) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const updatedVariables = updatedPipelineSchedule.variables;
            const crtPipelineSchedule = yield this.getPipelineSchedulesQuery(projectPath, pipelineScheduleId);
            const crtPipelineScheduleVariables = (_a = crtPipelineSchedule.project.pipelineSchedules.nodes[0]) === null || _a === void 0 ? void 0 : _a.variables.nodes;
            const _variables = crtPipelineScheduleVariables === null || crtPipelineScheduleVariables === void 0 ? void 0 : crtPipelineScheduleVariables.map((pipelineVariable) => {
                const updatedVariable = updatedVariables.find((variable) => variable.key === pipelineVariable.key);
                // check pipelineVariable is deleted by key
                const isDeleted = updatedVariables.findIndex((variable) => variable.key === pipelineVariable.key) === -1;
                return Object.assign(Object.assign({}, pipelineVariable), { __typename: undefined, value: (updatedVariable === null || updatedVariable === void 0 ? void 0 : updatedVariable.value) || '', destroy: isDeleted });
            });
            // check if there are new variables in updatedVariables by key
            const newVariables = updatedVariables.filter((variable) => {
                return ((crtPipelineScheduleVariables === null || crtPipelineScheduleVariables === void 0 ? void 0 : crtPipelineScheduleVariables.findIndex((pipelineVariable) => pipelineVariable.key === variable.key)) === -1);
            });
            const _newVariables = newVariables.map((_newVariable) => {
                return {
                    key: _newVariable.key,
                    value: _newVariable.value,
                    variableType: 'ENV_VAR',
                };
            });
            if (newVariables.length > 0) {
                _variables === null || _variables === void 0 ? void 0 : _variables.push(..._newVariables);
            }
            const payload = {
                operationName: 'updatePipelineSchedule',
                query: gitlab_graphql_query_1.updatePipelineScheduleMutationStr,
                variables: {
                    input: Object.assign(Object.assign({}, crtPipelineSchedule.project.pipelineSchedules.nodes[0]), { active: updatedPipelineSchedule.activate, cron: updatedPipelineSchedule.cron, cronTimezone: updatedPipelineSchedule.cronTimezone, description: updatedPipelineSchedule.description, ref: updatedPipelineSchedule.ref, variables: _variables, 
                        // remove unused fields
                        __typename: undefined, editPath: undefined, forTag: undefined, lastPipeline: undefined, nextRunAt: undefined, realNextRun: undefined, refForDisplay: undefined, refPath: undefined, userPermissions: undefined, owner: undefined }),
                },
            };
            const res = yield this.client.post('', payload);
            return res;
        });
    }
    _init() {
        this._token = (0, get_gl_token_1.getTokenFromLocalStorage)();
        this._initInterceptor();
    }
}
exports.GitlabGraphqlClient = GitlabGraphqlClient;
