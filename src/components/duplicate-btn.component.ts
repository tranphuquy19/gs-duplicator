import $ from "jquery";

import { gitlabSvgIconUrl } from "@/config";
import { GitlabClient } from "@/shared";

export function DuplicateBtnComponent(scheduleId?: string) {
	if (!scheduleId) {
		return null;
	}
	const duplicateBtnHtml =
		`<a title="Duplicate" class="btn gl-button btn-default btn-icon">
			<svg class="s16" data-testid="duplicate-icon">
				<use href="${gitlabSvgIconUrl}#duplicate"></use>
			</svg>
		</a>`;
	const duplicateBtnJObject = $(duplicateBtnHtml);
	// add click event to the duplicateBtn
	duplicateBtnJObject.click(async () => {
		const glClient = new GitlabClient();
		const schedule = await glClient.getPipeLineScheduleById(scheduleId);

		const newSchedule = await glClient.createPipelineSchedule({
			active: schedule.active,
			cron: schedule.cron,
			cron_timezone: schedule.cron_timezone,
			description: `${schedule.description}-copy`,
			ref: schedule.ref,
			variables: schedule.variables,
		});
		if (!!newSchedule && confirm(`Duplicate schedule success! Go to the edit page?`)) {
			window.location.href = `${window.location.href}/${newSchedule?.id}/edit`;
		} else {
			window.location.reload();
		}
	});
	return duplicateBtnJObject;
}
