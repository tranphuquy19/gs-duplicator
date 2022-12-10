import { GitlabScheduleVariableTypes } from "./gitlab-schedule-variable-types.enum";

export interface GitlabScheduleVariable {
	key: string;
	variable_type: GitlabScheduleVariableTypes;
	value: string;
}
