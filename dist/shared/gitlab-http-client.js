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
exports.GitlabHttpClient = void 0;
const axios_1 = require("axios");
const config_1 = require("@/config");
const types_1 = require("@/types");
const get_gl_token_1 = require("./get-gl-token");
const http_client_base_1 = require("./http-client-base");
class GitlabHttpClient extends http_client_base_1.HttpClient {
    constructor(_token) {
        super(config_1.gitlabApiUrl);
        this._token = _token;
        this._handleRequest = (config) => {
            if (!!config && !!config.headers) {
                config.headers['PRIVATE-TOKEN'] = this._token || '';
            }
            return config;
        };
        this._handleUnauthorizedError = (error) => {
            var _a;
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                this._token = (0, get_gl_token_1.getGitlabToken)();
            }
            return Promise.reject(error);
        };
        this._initInterceptor = () => {
            this.client.interceptors.request.use(this._handleRequest, this._handleError);
        };
        this._init();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new GitlabHttpClient();
        }
        return this.instance;
    }
    getPipelines() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipelines = yield this.client.get(`projects/${config_1.gitlabProjectId}/pipelines`);
                return pipelines;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    getPipelineSchedules() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedules = yield this.client.get(`projects/${config_1.gitlabProjectId}/pipeline_schedules`);
                return schedules;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    getPipeLineScheduleById(scheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!scheduleId) {
                throw new Error('scheduleId is required');
            }
            try {
                const schedule = yield this.client.get(`projects/${config_1.gitlabProjectId}/pipeline_schedules/${scheduleId}`);
                return schedule;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    createPipelineSchedule(schedule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSchedule = yield this.client.post(`projects/${config_1.gitlabProjectId}/pipeline_schedules`, schedule);
                const { id } = newSchedule;
                yield Promise.all((schedule.variables || []).map((variable) => this.createPipelineScheduleVariable(id, variable)));
                return newSchedule;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    createPipelineScheduleVariable(scheduleId, variable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!scheduleId) {
                throw new Error('scheduleId is required');
            }
            const _newVariable = {
                key: variable.key,
                value: variable.value,
                variable_type: variable.variable_type !== types_1.CreateGitlabScheduleVariableTypes.FILE
                    ? types_1.CreateGitlabScheduleVariableTypes.ENV_VAR
                    : types_1.CreateGitlabScheduleVariableTypes.FILE,
            };
            try {
                const newVariable = yield this.client.post(`projects/${config_1.gitlabProjectId}/pipeline_schedules/${scheduleId}/variables`, _newVariable);
                return newVariable;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    getProjectBranches(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const branches = yield this.client.get(`projects/${projectId || config_1.gitlabProjectId}/repository/branches?per_page=${config_1.gitlabRestPerPage}`);
                return branches.map((branch) => branch.name);
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    getProjectVariables(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const variables = yield this.client.get(`projects/${projectId}/variables`);
                return variables;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    this._handleUnauthorizedError(error);
                }
            }
        });
    }
    _init() {
        this._token = (0, get_gl_token_1.getTokenFromLocalStorage)();
        this._initInterceptor();
    }
}
exports.GitlabHttpClient = GitlabHttpClient;
