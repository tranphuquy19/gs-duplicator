import $ from "jquery";

import { GitlabClient } from "@/shared";

export function DuplicateBtnComponent(scheduleId?: string) {
	if (!scheduleId) {
		return null;
	}
	const duplicateBtnHtml =
		`<a title="Duplicate" class="btn gl-button btn-default btn-icon">
			<svg class="s16" data-testid="duplicate-icon">
				<use href="/assets/icons-29e9caf34d9cc5889ea5f1dce460a0578cd14318aabc385b1fe54ce6069c9874.svg#duplicate"></use>
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
		if (confirm(`Duplicate schedule success! Go to the edit page?`)) {
			window.location.href = `${window.location.href}/${newSchedule?.id}/edit`;
		} else {
			window.location.reload();
		}
	});
	return duplicateBtnJObject;
}
