import { GetTheOptionsFrom } from '@/shared';

export interface GitlabToolSettings {
  gitlabDefaultPipelineSchedule: GitlabDefaultPipelineSchedule;
  wrappedVarBy: string;
  gitlabSvgIconUrl: string;
  gitlabRestPerPage: number;
  includeAllVariables?: boolean;
  getTheOptionsFrom?: GetTheOptionsFrom;
  autoShowDropDown?: boolean;
  enableMarkdownVarDescription?: boolean;
  sortVarByName?: boolean;
  replaceEnterWithN?: boolean;
}

export interface GitlabDefaultPipelineSchedule {
  active: boolean;
  cron: string;
  description: string;
  cron_timezone: string;
  ref: string;
}
