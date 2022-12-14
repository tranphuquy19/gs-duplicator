import { AxiosError, AxiosRequestConfig } from "axios";

import { gitlabApiUrl, gitlabProjectId } from "@/config";
import { GitlabBranch, GitlabPipeline, GitlabSchedule, GitlabScheduleVariable } from "@/types";
import { getGitlabToken, getTokenFromLocalStorage } from "./get-gl-token";
import { HttpClient } from "./http-client-base";

export class GitlabHttpClient extends HttpClient {
	private static instance?: GitlabHttpClient;

	constructor(private _token?: string) {
		super(gitlabApiUrl);
		this._init();
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new GitlabHttpClient();
		}
		return this.instance;
	}

	async getPipelines(): Promise<GitlabPipeline[]> {
		const pipelines = await this.client.get<GitlabPipeline[]>(`projects/${gitlabProjectId}/pipelines`);
		return pipelines;
	}

	async getPipelineSchedules(): Promise<GitlabSchedule[]> {
		const schedules = await this.client.get<GitlabSchedule[]>(`projects/${gitlabProjectId}/pipeline_schedules`);
		return schedules;
	}

	async getPipeLineScheduleById(scheduleId?: string): Promise<GitlabSchedule> {
		if (!scheduleId) {
			throw new Error('scheduleId is required');
		}
		const schedule = await this.client.get<GitlabSchedule>(`projects/${gitlabProjectId}/pipeline_schedules/${scheduleId}`);
		return schedule;
	}

	async createPipelineSchedule(schedule: GitlabSchedule): Promise<GitlabSchedule> {
		const newSchedule = await this.client.post<GitlabSchedule>(`projects/${gitlabProjectId}/pipeline_schedules`, schedule);
		const { id } = newSchedule;

		await Promise.all((schedule.variables || []).map(variable => this.createPipelineScheduleVariable(id, variable)));
		return newSchedule;
	}

	async createPipelineScheduleVariable(scheduleId: number | undefined, variable: GitlabScheduleVariable): Promise<GitlabScheduleVariable> {
		if (!scheduleId) {
			throw new Error('scheduleId is required');
		}
		const newVariable = await this.client.post<GitlabScheduleVariable>(`projects/${gitlabProjectId}/pipeline_schedules/${scheduleId}/variables`, variable);
		return newVariable;
	}

	async getProjectBranches(): Promise<string[]> {
		const branches = await this.client.get<GitlabBranch[]>(`projects/${gitlabProjectId}/repository/branches`);

		return branches.map((branch: any) => branch.name);
	}

	private _init() {
		this._token = getTokenFromLocalStorage();
		this._initInterceptor();
	}

	private _initInterceptor = () => {
		this.client.interceptors.request.use(
			this._handleRequest,
			this._handleError,
		);
	}

	private _handleRequest = (config: AxiosRequestConfig): AxiosRequestConfig<any> => {
		if (!!config && !!config.headers) {
			config.headers['PRIVATE-TOKEN'] = this._token || '';
		}
		return config;
	}

	protected _handleError = (error: AxiosError) => {
		if (error.response?.status === 401) {
			this._token = getGitlabToken();
		}
		return Promise.reject(error);
	}

}
