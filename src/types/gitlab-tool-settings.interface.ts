export interface GitlabToolSettings {
  gitlabDefaultPipelineSchedule: GitlabDefaultPipelineSchedule;
  wrappedVarBy: string;
  gitlabSvgIconUrl: string;
  gitlabRestPerPage: number;
  includeAllVariables: boolean;
}

export interface GitlabDefaultPipelineSchedule {
  active: boolean;
  cron: string;
  description: string;
  cron_timezone: string;
  ref: string;
}
