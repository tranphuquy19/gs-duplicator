import { GitlabScheduleOwner } from './gitlab-schedule-owner.dto';
import { GitlabScheduleVariable } from './gitlab-schedule-variable.dto';

export interface GitlabSchedule {
  id?: number;
  active: boolean;
  created_at?: string;
  cron: string;
  cron_timezone: string;
  description: string;
  next_run_at?: string;
  ref: string;
  updated_at?: string;
  owner?: GitlabScheduleOwner;
  variables?: GitlabScheduleVariable[];
}
