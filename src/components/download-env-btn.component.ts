import $ from "jquery/dist/jquery.slim";

import { gitlabSvgIconUrl } from "@/config";
import { downloadEnvFile, GitlabHttpClient } from "@/shared";

export function DownloadEnvBtnComponent(scheduleId?: string) {
	if (!scheduleId) {
		return;
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
		const glClient = GitlabHttpClient.getInstance();
		const schedule = await glClient.getPipeLineScheduleById(scheduleId);
		if (!schedule) return;

		downloadEnvFile(schedule.variables ?? [], schedule.description);
	});
	return downloadEnvBtnJObject;
}
