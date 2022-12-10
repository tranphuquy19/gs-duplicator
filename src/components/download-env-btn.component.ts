import $ from "jquery";

import { downloadEnvFile, GitlabClient } from "@/shared";

export function DownloadEnvBtnComponent(scheduleId?: string) {
	if (!scheduleId) {
		return null;
	}
	const downloadEnvBtnHtml =
		`<a title="Download Env File" class="btn gl-button btn-default btn-icon">
			<svg class="s16" data-testid="download-icon">
				<use href="/assets/icons-29e9caf34d9cc5889ea5f1dce460a0578cd14318aabc385b1fe54ce6069c9874.svg#download"></use>
			</svg>
		</a>`;
	const downloadEnvBtnJObject = $(downloadEnvBtnHtml);
	// add click event to the downloadEnvBtn
	downloadEnvBtnJObject.click(async () => {
		const glClient = new GitlabClient();
		const schedule = await glClient.getPipeLineScheduleById(scheduleId);

		downloadEnvFile(schedule.variables ?? [], schedule.description);
	});
	return downloadEnvBtnJObject;
}
