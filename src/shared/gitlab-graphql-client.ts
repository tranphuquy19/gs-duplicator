import { AxiosError, AxiosRequestConfig } from 'axios';

import { gitlabGraphqlUrl } from '@/config';
import {
  GetPipelineSchedules,
  GitlabCiConfigVariable,
  GitlabScheduleVariable,
  GitlabScheduleVariableTypes,
  GlGetCiConfigVariableResponse,
  UpdatePipelineScheduleVariable,
  PipelineScheduleData,
  PipelineScheduleVariable,
  UpdatePipelineSchedule,
} from '@/types';
import { getGitlabToken, getTokenFromLocalStorage } from './get-gl-token';
import {
  getCiConfigVariablesQueryStr,
  getPipelineSchedulesQueryStr,
  updatePipelineScheduleMutationStr,
} from './gitlab-graphql.query';
import { getScheduleIdFromGid } from './gitlab-resource-extractor';
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

  /**
   * Get Gitlab pipeline schedules by ids
   * @param projectPath
   * @param ids - let null to get all schedules
   * @returns
   */
  async getPipelineSchedulesQuery(
    projectPath: string,
    ids: string | null = null
  ): Promise<PipelineScheduleData> {
    const { data } = await this.client.post<GetPipelineSchedules>('', {
      operationName: 'getPipelineSchedulesQuery',
      query: getPipelineSchedulesQueryStr,
      variables: {
        ids: ids,
        projectPath,
      },
    });
    return data;
  }

  async getPipelineScheduleIdsQuery(projectPath: string): Promise<any[]> {
    const res = await this.getPipelineSchedulesQuery(projectPath);

    return res?.project?.pipelineSchedules?.nodes?.map((node: any) => {
      return getScheduleIdFromGid(node.id);
    });
  }

  async updatePipelineSchedule(
    pipelineScheduleId: string,
    projectPath: string,
    updatedPipelineSchedule: UpdatePipelineSchedule
  ): Promise<any> {
    const updatedVariables = updatedPipelineSchedule.variables;
    const crtPipelineSchedule = await this.getPipelineSchedulesQuery(
      projectPath,
      pipelineScheduleId
    );

    const crtPipelineScheduleVariables = crtPipelineSchedule.project.pipelineSchedules.nodes[0]
      ?.variables.nodes as PipelineScheduleVariable[];

    const _variables: PipelineScheduleVariable[] =
      crtPipelineScheduleVariables?.map<PipelineScheduleVariable>(
        (pipelineVariable: PipelineScheduleVariable) => {
          const updatedVariable = updatedVariables.find(
            (variable: UpdatePipelineScheduleVariable) => variable.key === pipelineVariable.key
          );
          // check pipelineVariable is deleted by key
          const isDeleted: boolean =
            updatedVariables.findIndex(
              (variable: UpdatePipelineScheduleVariable) => variable.key === pipelineVariable.key
            ) === -1;

          return {
            ...pipelineVariable,
            __typename: undefined,
            value: updatedVariable?.value || '',
            destroy: isDeleted,
          };
        }
      );

    // check if there are new variables in updatedVariables by key
    const newVariables = updatedVariables.filter((variable: UpdatePipelineScheduleVariable) => {
      return (
        crtPipelineScheduleVariables?.findIndex(
          (pipelineVariable: PipelineScheduleVariable) => pipelineVariable.key === variable.key
        ) === -1
      );
    });

    const _newVariables = newVariables.map<PipelineScheduleVariable>(
      (_newVariable: UpdatePipelineScheduleVariable) => {
        return {
          key: _newVariable.key,
          value: _newVariable.value,
          variableType: 'ENV_VAR',
        };
      }
    );

    if (newVariables.length > 0) {
      _variables?.push(..._newVariables);
    }

    const payload = {
      operationName: 'updatePipelineSchedule',
      query: updatePipelineScheduleMutationStr,
      variables: {
        input: {
          ...crtPipelineSchedule.project.pipelineSchedules.nodes[0],
          active: updatedPipelineSchedule.activate,
          cron: updatedPipelineSchedule.cron,
          cronTimezone: updatedPipelineSchedule.cronTimezone,
          description: updatedPipelineSchedule.description,
          ref: updatedPipelineSchedule.ref,
          variables: _variables,

          // remove unused fields
          __typename: undefined,
          editPath: undefined,
          forTag: undefined,
          lastPipeline: undefined,
          nextRunAt: undefined,
          realNextRun: undefined,
          refForDisplay: undefined,
          refPath: undefined,
          userPermissions: undefined,
          owner: undefined,
        },
      },
    };

    const res = await this.client.post<any>('', payload);
    return res;
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
