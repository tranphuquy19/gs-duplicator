import {
  ChooseBranchDropdownComponent,
  DownloadEnvBtnComponent,
  DuplicateBtnComponent,
  GitlabToolSettingsBtnComponent,
  QuickNewScheduleBtnComponent,
} from '@/components';
import {
  GitlabGraphqlClient,
  getProjectFullPath,
  getScheduleIdFromGid,
  waitForElement,
} from '@/shared';
import { GetPipelineScheduleNode } from '@/types';

export const pipelineSchedulesPage = async () => {
  const glGraphqlClient = GitlabGraphqlClient.getInstance();
  const fullPath = getProjectFullPath(window.location.pathname as string);
  const [schedules, _] = await Promise.all([
    glGraphqlClient.getPipelineSchedulesQuery(fullPath),
    waitForElement('tr[data-testid="pipeline-schedule-table-row"]'), // wait for the pipeline schedule table to be rendered
  ]);

  // find the buttons with attribute title="Play" in the btnGroup
  // let playBtns = $('.tab-pane.active').find('.btn-group').find(`[title='Run pipeline schedule']`);
  // if (playBtns.length === 0) {
  //   playBtns = $('.btn-group').find(`[title='Play']`);
  // }

  // find the button with text "New schedule"
  const newScheduleBtns = $('.btn.btn-confirm:contains("New schedule")');
  const newScheduleBtn = $(newScheduleBtns.get());
  const quickNewScheduleBtn = QuickNewScheduleBtnComponent();
  const settingsBtn = GitlabToolSettingsBtnComponent();

  // create a new div btnGroup with class ml-auto, move the newScheduleBtn to the enter of the new btnGroup
  const newBtnGroup = $('<div class="gl-ml-auto"></div>');
  newBtnGroup.insertBefore(newScheduleBtn);
  newScheduleBtn.appendTo(newBtnGroup);

  if (quickNewScheduleBtn) {
    quickNewScheduleBtn.insertBefore(newScheduleBtn);
    settingsBtn.insertAfter(newScheduleBtn);
  }

  // find the buttons with attribute datat-testid="delete-pipeline-schedule-btn" in the btnGroup
  const deleteBtns = $('.tab-pane.active')
    .find('.btn-group')
    .find(`[data-testid='delete-pipeline-schedule-btn']`);

  for (const [_, btnItem] of Array.from(deleteBtns).entries()) {
    const delBtn = $(btnItem);
    const scheduleDesc = delBtn
      .closest('tr')
      .find('[data-testid="pipeline-schedule-description"]')
      .text()
      .trim();

    const rowSchedule = schedules.project.pipelineSchedules.nodes.find((sch) => {
      return sch.description === scheduleDesc;
    }) as unknown as GetPipelineScheduleNode;
    const scheduleIndex = getScheduleIdFromGid(rowSchedule.id);

    // const playBtnHref = editBtn.attr('href') as string;
    // const scheduleId = getGitlabScheduleIdFromUrl(playBtnHref);
    const duplicateBtn = DuplicateBtnComponent(scheduleIndex);
    if (duplicateBtn) {
      duplicateBtn.insertBefore(delBtn);
      const downloadEnvFileBtn = DownloadEnvBtnComponent(scheduleIndex);
      if (downloadEnvFileBtn) {
        downloadEnvFileBtn.insertBefore(duplicateBtn);
      }
    }
  }

  const glChooseBranchDropdown = await ChooseBranchDropdownComponent();
  glChooseBranchDropdown.insertBefore(quickNewScheduleBtn);
};
