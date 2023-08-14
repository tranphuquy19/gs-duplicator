import {
  ChooseBranchDropdownComponent,
  DownloadEnvBtnComponent,
  DuplicateBtnComponent,
  GitlabToolSettingsBtnComponent,
  QuickNewScheduleBtnComponent,
} from '@/components';
import { GitlabGraphqlClient, getProjectFullPath } from '@/shared';

export const pipelineSchedulesPage = async () => {
  const glGraphqlClient = GitlabGraphqlClient.getInstance();
  const fullPath = getProjectFullPath(window.location.pathname as string);
  const pipeLineIds = await glGraphqlClient.getPipelineScheduleIdsQuery(fullPath);

  const btnGroup = $('.tab-pane.active').find('.btn-group');

  // find the buttons with attribute title="Play" in the btnGroup
  const playBtns = btnGroup.find(`[title='Run pipeline schedule']`);
  for (const [index, btnItem] of Array.from(playBtns).entries()) {
    const editBtn = $(btnItem);
    // const playBtnHref = editBtn.attr('href') as string;
    // const scheduleId = getGitlabScheduleIdFromUrl(playBtnHref);
    const duplicateBtn = DuplicateBtnComponent(pipeLineIds[index]);
    if (duplicateBtn) {
      duplicateBtn.insertAfter(editBtn);
      const downloadEnvFileBtn = DownloadEnvBtnComponent(pipeLineIds[index]);
      if (downloadEnvFileBtn) {
        downloadEnvFileBtn.insertBefore(duplicateBtn);
      }
    }
  }

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

  const glChooseBranchDropdown = await ChooseBranchDropdownComponent();
  glChooseBranchDropdown.insertBefore(quickNewScheduleBtn);
};
