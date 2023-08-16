import $ from 'jquery/dist/jquery.slim';

import { gitlabDefaultPipelineSchedule, gitlabSvgIconUrl, includeAllVariables } from '@/config';
import {
  downloadEnvFile,
  getProjectFullPath,
  GitlabGraphqlClient,
  GitlabHttpClient,
  leftJoin,
} from '@/shared';
import { GitlabScheduleVariable } from '@/types';

export function DownloadEnvBtnComponent(scheduleId?: string) {
  if (!scheduleId) {
    return;
  }
  const downloadEnvBtnHtml = `<a title="Download Env File" class="btn gl-button btn-default btn-icon">
			<svg class="s16" data-testid="download-icon">
				<use href="${gitlabSvgIconUrl}#download"></use>
			</svg>
		</a>`;
  const downloadEnvBtnJObject = $(downloadEnvBtnHtml);
  // add click event to the downloadEnvBtn
  downloadEnvBtnJObject.on('click', async () => {
    const glClient = GitlabHttpClient.getInstance();
    const glGraphqlClient = GitlabGraphqlClient.getInstance();
    const variables: GitlabScheduleVariable[] = [];
    const schedule = await glClient.getPipeLineScheduleById(scheduleId);
    if (!schedule) return;

    if (includeAllVariables) {
      const fullPath = getProjectFullPath(window.location.pathname as string);

      const ciVariables =
        (await glGraphqlClient.getCiConfigVariables(
          fullPath,
          schedule?.ref || gitlabDefaultPipelineSchedule.ref
        )) || [];

      // left join ciVariables and schedule.variables
      const joined = leftJoin<GitlabScheduleVariable, 'key'>(
        ciVariables,
        schedule?.variables ?? [],
        'key',
        (left, right) => ({
          ...left,
          ...right,
        })
      );
      variables.push(...joined);
    } else {
      variables.push(...(schedule?.variables ?? []));
    }

    downloadEnvFile(variables, schedule.description);
  });
  return downloadEnvBtnJObject;
}
