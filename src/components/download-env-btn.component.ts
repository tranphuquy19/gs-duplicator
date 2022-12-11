import $ from "jquery";

import { gitlabSvgIconUrl } from "@/config";
import { downloadEnvFile, GitlabClient } from "@/shared";

export function DownloadEnvBtnComponent(scheduleId?: string) {
	if (!scheduleId) {
		return null;
	}
	const downloadEnvBtnHtml =
		`<a title="Download Env File" class="btn gl-button btn-default btn-icon">
			<svg class="s16" data-testid="download-icon">
				<use href="${gitlabSvgIconUrl}#download"></use>
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
