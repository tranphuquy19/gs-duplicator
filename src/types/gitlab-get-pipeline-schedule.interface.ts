export interface GetPipelineSchedules {
  data: PipelineScheduleData;
}

export interface PipelineScheduleData {
  currentUser: PipelineScheduleCurrentUser;
  project: PipelineScheduleProject;
}

export interface PipelineScheduleCurrentUser {
  id: string;
  username: string;
  __typename?: string;
}

export interface PipelineScheduleProject {
  id: string;
  pipelineSchedules: PipelineSchedules;
  __typename?: string;
}

export interface PipelineSchedules {
  count: number;
  nodes: GetPipelineScheduleNode[];
  __typename?: string;
}

export interface GetPipelineScheduleNode {
  id: string;
  description: string;
  cron: string;
  cronTimezone: string;
  ref: string;
  forTag: boolean;
  editPath?: string;
  refPath: string;
  refForDisplay: string;
  lastPipeline?: PipelineScheduleLastPipeline;
  active: boolean;
  nextRunAt: string;
  realNextRun: string;
  owner: PipelineScheduleOwner;
  variables: PipelineScheduleVariables;
  userPermissions: PipelineScheduleUserPermissions;
  __typename?: string;
}

export interface PipelineScheduleLastPipeline {
  id: string;
  detailedStatus: PipelineScheduleDetailedStatus;
  __typename?: string;
}

export interface PipelineScheduleDetailedStatus {
  id: string;
  group: string;
  icon: string;
  label: string;
  text: string;
  detailsPath: string;
  __typename?: string;
}

export interface PipelineScheduleOwner {
  id: string;
  username: string;
  avatarUrl: string;
  name: string;
  webPath: string;
  __typename?: string;
}

export interface PipelineScheduleVariables {
  nodes: PipelineScheduleVariable[];
  __typename?: string;
}

export interface PipelineScheduleVariable {
  id?: string;
  variableType: string;
  key: string;
  value: string;
  destroy?: boolean;
  __typename?: string;
}

export interface PipelineScheduleUserPermissions {
  playPipelineSchedule: boolean;
  updatePipelineSchedule: boolean;
  adminPipelineSchedule: boolean;
  __typename?: string;
}
