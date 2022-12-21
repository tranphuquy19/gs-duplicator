import { GitlabScheduleVariableTypes } from './gitlab-schedule-variable-types.enum';

export interface GitlabEditVarValue {
  valueInput: JQuery<HTMLElement>;
}

export interface GitlabEditVarRow {
  key: string;
  variableType: GitlabScheduleVariableTypes;
  original: GitlabEditVarValue;
  clone: GitlabEditVarValue | null;
}
