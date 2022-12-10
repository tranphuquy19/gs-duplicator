import { AxiosError } from "axios";

import { gitlabProjectId, gitlabTokenLocalStorageKey } from "@/config";
import { GitlabSchedule, HttpMethods } from "@/types";
import { HttpClient } from "./http-client";
import { GitlabScheduleVariable } from "@/types/gitlab-schedule-variable.dto";

export class GitlabClient {
	constructor(private _token?: string) {
		this.init();
	}

	async getPipelines() {
		const { data } = await HttpClient(`projects/${gitlabProjectId}/pipelines`, HttpMethods.GET, {});
		return data;
	}

	async getPipelineSchedules(): Promise<Array<GitlabSchedule>> {
		const { data } = await HttpClient(`projects/${gitlabProjectId}/pipeline_schedules`, HttpMethods.GET, {});
		return data;
	}

	async getPipeLineScheduleById(scheduleId?: string): Promise<GitlabSchedule> {
		if (!scheduleId) {
			throw new Error("scheduleId is required");
		}
		const { data } = await HttpClient(`projects/${gitlabProjectId}/pipeline_schedules/${scheduleId}`, HttpMethods.GET, {}, { token: this._token });
		return data;
	}

	async createPipelineSchedule(schedule: GitlabSchedule): Promise<GitlabSchedule | undefined> {
		console.log('schedule', schedule);

		try {
			const { data } = await HttpClient(`projects/${gitlabProjectId}/pipeline_schedules`, HttpMethods.POST, schedule, { token: this._token });
			const { id } = data as GitlabSchedule;
			// for (const variable of schedule.variables || []) {
			// 	console.log(variable);

			// 	await this.createPipelineScheduleVariable(id, variable);
			// }
			await Promise.all((schedule.variables || []).map(variable => this.createPipelineScheduleVariable(id, variable)));
			return data as GitlabSchedule;
		} catch (err) {
			this.processError(err);
			return this.createPipelineSchedule(schedule);
		}
	}

	async createPipelineScheduleVariable(scheduleId: number | undefined, variable: GitlabScheduleVariable): Promise<GitlabScheduleVariable> {
		if (!scheduleId) {
			throw new Error("scheduleId is required");
		}
		try {
			const { data } = await HttpClient(`projects/${gitlabProjectId}/pipeline_schedules/${scheduleId}/variables`, HttpMethods.POST, variable, { token: this._token });
			return data;
		} catch (err) {
			this.processError(err);
			return this.createPipelineScheduleVariable(scheduleId, variable);
		}
	}

	private init() {
		this._token = this.getTokenFromLocalStorage();
	}

	private getTokenFromLocalStorage(): string {
		const _lsToken = window.atob(localStorage.getItem(gitlabTokenLocalStorageKey) || "");
		if (_lsToken && _lsToken.length > 0) {
			return _lsToken;
		} else {
			return "";
		}
	}

	private processError(err: Error | unknown) {
		if (err instanceof AxiosError) {
			const { response } = err;
			const status = response?.status;

			if (status === 401) {
				localStorage.removeItem(gitlabTokenLocalStorageKey);
				this.getGitlabToken();
			} else {
				alert(`Error: ${response?.data?.message || 'Unknown error'}`);
			}
		}
	}

	private getGitlabToken() {
		const inputToken = prompt("Invalid Gitlab token. Please enter a valid token:");
		if (inputToken && inputToken.length > 0) {
			this._token = inputToken;
			localStorage.setItem(gitlabTokenLocalStorageKey, window.btoa(inputToken));
		} else {
			throw new Error("token is required");
		}
	}
}
