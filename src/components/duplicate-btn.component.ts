import $ from 'jquery/dist/jquery.slim';

import { gitlabSvgIconUrl } from '@/config';
import { GitlabHttpClient } from '@/shared';

export function DuplicateBtnComponent(scheduleId?: string) {
  if (!scheduleId) {
    return;
  }
  const duplicateBtnHtml = `
		<a title="Duplicate" class="btn gl-button btn-default btn-icon">
			<svg class="s16" data-testid="duplicate-icon">
				<use href="${gitlabSvgIconUrl}#duplicate"></use>
			</svg>
		</a>`;
  const duplicateBtnJObject = $(duplicateBtnHtml);
  // add click event to the duplicateBtn
  duplicateBtnJObject.on('click', async function () {
    const glClient = GitlabHttpClient.getInstance();
    const schedule = await glClient.getPipeLineScheduleById(scheduleId);
    if (!schedule) return;

    const newSchedule = await glClient.createPipelineSchedule({
      active: schedule.active,
      cron: schedule.cron,
      cron_timezone: schedule.cron_timezone,
      description: `${schedule.description}-copy`,
      ref: schedule.ref,
      variables: schedule.variables,
    });
    if (!!newSchedule && confirm(`Duplicated successfully! Go to the edit page?`)) {
      window.location.href = `${window.location.href}/${newSchedule?.id}/edit`;
    } else {
      window.location.reload();
    }
  });
  return duplicateBtnJObject;
}
