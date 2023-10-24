import { AxiosError, AxiosRequestConfig } from 'axios';

import { gitlabApiUrl, gitlabProjectId, gitlabRestPerPage } from '@/config';
import {
  CreateGitlabScheduleVariable,
  CreateGitlabScheduleVariableTypes,
  GitlabBranch,
  GitlabCiConfigVariable,
  GitlabPipeline,
  GitlabSchedule,
  GitlabScheduleVariable,
  GitlabScheduleVariableTypes,
} from '@/types';
import { getGitlabToken, getTokenFromLocalStorage } from './get-gl-token';
import { HttpClient } from './http-client-base';

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

  async getPipelines(): Promise<GitlabPipeline[] | undefined> {
    try {
      const pipelines = await this.client.get<GitlabPipeline[]>(
        `projects/${gitlabProjectId}/pipelines`
      );
      return pipelines;
    } catch (error) {
      if (error instanceof AxiosError) {
        this._handleUnauthorizedError(error);
      }
    }
  }

  async getPipelineSchedules(): Promise<GitlabSchedule[] | undefined> {
    try {
      const schedules = await this.client.get<GitlabSchedule[]>(
        `projects/${gitlabProjectId}/pipeline_schedules`
      );
      return schedules;
    } catch (error) {
      if (error instanceof AxiosError) {
        this._handleUnauthorizedError(error);
      }
    }
  }

  async getPipeLineScheduleById(scheduleId?: string): Promise<GitlabSchedule | undefined> {
    if (!scheduleId) {
      throw new Error('scheduleId is required');
    }
    try {
      const schedule = await this.client.get<GitlabSchedule>(
        `projects/${gitlabProjectId}/pipeline_schedules/${scheduleId}`
      );
      return schedule;
    } catch (error) {
      if (error instanceof AxiosError) {
        this._handleUnauthorizedError(error);
      }
    }
  }

  async createPipelineSchedule(schedule: GitlabSchedule): Promise<GitlabSchedule | undefined> {
    try {
      const newSchedule = await this.client.post<GitlabSchedule>(
        `projects/${gitlabProjectId}/pipeline_schedules`,
        schedule
      );
      const { id } = newSchedule;

      await Promise.all(
        (schedule.variables || []).map((variable) =>
          this.createPipelineScheduleVariable(id, variable)
        )
      );
      return newSchedule;
    } catch (error) {
      if (error instanceof AxiosError) {
        this._handleUnauthorizedError(error);
      }
    }
  }

  async createPipelineScheduleVariable(
    scheduleId: number | undefined,
    variable: GitlabScheduleVariable
  ): Promise<CreateGitlabScheduleVariable | undefined> {
    if (!scheduleId) {
      throw new Error('scheduleId is required');
    }

    const _newVariable: CreateGitlabScheduleVariable = {
      key: variable.key,
      value: variable.value,
      variable_type:
        variable.variable_type !== CreateGitlabScheduleVariableTypes.FILE
          ? CreateGitlabScheduleVariableTypes.ENV_VAR
          : CreateGitlabScheduleVariableTypes.FILE,
    };
    try {
      const newVariable = await this.client.post<CreateGitlabScheduleVariable>(
        `projects/${gitlabProjectId}/pipeline_schedules/${scheduleId}/variables`,
        _newVariable
      );
      return newVariable;
    } catch (error) {
      if (error instanceof AxiosError) {
        this._handleUnauthorizedError(error);
      }
    }
  }

  async getProjectBranches(projectId?: string): Promise<string[] | undefined> {
    try {
      const branches = await this.client.get<GitlabBranch[]>(
        `projects/${projectId || gitlabProjectId}/repository/branches?per_page=${gitlabRestPerPage}`
      );

      return branches.map((branch: any) => branch.name);
    } catch (error) {
      if (error instanceof AxiosError) {
        this._handleUnauthorizedError(error);
      }
    }
  }

  async getProjectVariables(projectId: string): Promise<GitlabCiConfigVariable | undefined> {
    try {
      const variables = await this.client.get<GitlabCiConfigVariable>(
        `projects/${projectId}/variables`
      );
      return variables;
    } catch (error) {
      if (error instanceof AxiosError) {
        this._handleUnauthorizedError(error);
      }
    }
  }

  private _init() {
    this._token = getTokenFromLocalStorage();
    this._initInterceptor();
  }

  private _handleRequest = (config: AxiosRequestConfig): AxiosRequestConfig<any> => {
    if (!!config && !!config.headers) {
      config.headers['PRIVATE-TOKEN'] = this._token || '';
    }
    return config;
  };

  private _handleUnauthorizedError = (error: AxiosError) => {
    if (error.response?.status === 401) {
      this._token = getGitlabToken();
    }
    return Promise.reject(error);
  };

  private _initInterceptor = () => {
    this.client.interceptors.request.use(this._handleRequest, this._handleError);
  };
}
