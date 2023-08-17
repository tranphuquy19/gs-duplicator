export interface UpdatePipelineScheduleVariable {
  key: string;
  value: string;
}

export interface UpdatePipelineSchedule {
  activate: boolean;
  cron: string;
  ref: string;
  cronTimezone: string;
  description: string;
  variables: UpdatePipelineScheduleVariable[];
}
