import { AxiosError, AxiosRequestConfig } from 'axios';

import { gitlabGraphqlUrl } from '@/config';
import {
  GitlabCiConfigVariable,
  GitlabScheduleVariable,
  GitlabScheduleVariableTypes,
  GlGetCiConfigVariableResponse,
} from '@/types';
import { getGitlabToken, getTokenFromLocalStorage } from './get-gl-token';
import { getCiConfigVariablesQueryStr } from './gitlab-graphql.query';
import { HttpClient } from './http-client-base';

export class GitlabGraphqlClient extends HttpClient {
  private static instance?: GitlabGraphqlClient;
  private RETRIES = 3;

  constructor(private _token?: string) {
    super(gitlabGraphqlUrl);
    this._init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new GitlabGraphqlClient();
    }
    return this.instance;
  }

  async getCiConfigVariables(
    projectUrl: string,
    ref: string
  ): Promise<GitlabScheduleVariable[] | undefined> {
    let ciConfigVariables: GitlabCiConfigVariable[] = [];
    let retries = 0;
    try {
      let isBreak = false;
      while (!isBreak && retries < this.RETRIES) {
        const { data: glGetCiConfigVarRes } = await this.client.post<GlGetCiConfigVariableResponse>(
          '',
          {
            operationName: 'ciConfigVariables',
            query: getCiConfigVariablesQueryStr,
            variables: {
              fullPath: projectUrl,
              ref,
            },
          }
        );
        if (glGetCiConfigVarRes?.project?.ciConfigVariables) {
          ciConfigVariables = glGetCiConfigVarRes.project.ciConfigVariables;
          isBreak = true;
        }
        retries++;
      }

      return ciConfigVariables
        ? ciConfigVariables
            .filter((variable: GitlabCiConfigVariable) => variable.description !== null)
            .map<GitlabScheduleVariable>((variable: GitlabCiConfigVariable) => ({
              key: variable.key,
              value: variable.value,
              description: variable.description,
              variable_type: GitlabScheduleVariableTypes.ENV_VAR,
            }))
        : [];
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
      config.headers['Authorization'] = `Bearer ${this._token}`;
    }
    return config;
  };

  private _handleUnauthorizedError = (error: AxiosError) => {
    if (error.response?.status === 401) {
      this._token = getGitlabToken();
    }
  };

  private _initInterceptor = () => {
    this.client.interceptors.request.use(this._handleRequest, this._handleError);
  };
}
