import {
  CreateGitlabScheduleVariableTypes,
  GitlabScheduleVariableTypes,
} from './gitlab-schedule-variable-types.enum';

export interface GitlabScheduleVariable {
  key: string;
  variable_type: GitlabScheduleVariableTypes;
  value: string;
  description: string;
  valueOptions: string[];
}

export interface CreateGitlabScheduleVariable {
  key: string;
  variable_type: CreateGitlabScheduleVariableTypes;
  value: string;
}
