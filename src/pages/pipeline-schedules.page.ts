import {
  DuplicateBtnComponent,
  DownloadEnvBtnComponent,
  QuickNewScheduleBtnComponent,
  ChooseBranchDropdownComponent,
  GitlabToolSettingsBtnComponent,
} from '@/components';
import { getGitlabScheduleIdFromUrl } from '@/shared';

export const pipelineSchedulesPage = async () => {
  const btnGroup = $('.float-right.btn-group');

  // find the buttons with attribute title="Edit" in the btnGroup
  const playBtns = btnGroup.find(`[title='Play']`);
  for (const btnItem of playBtns) {
    const playBtn = $(btnItem);
    const playBtnHref = playBtn.attr('href') as string;
    const scheduleId = getGitlabScheduleIdFromUrl(playBtnHref);
    const duplicateBtn = DuplicateBtnComponent(scheduleId);
    if (duplicateBtn) {
      duplicateBtn.insertAfter(playBtn);
      const downloadEnvFileBtn = DownloadEnvBtnComponent(scheduleId);
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
  if (quickNewScheduleBtn) {
    quickNewScheduleBtn.insertBefore(newScheduleBtn);
    settingsBtn.insertAfter(newScheduleBtn);
  }

  const glChooseBranchDropdown = await ChooseBranchDropdownComponent();
  glChooseBranchDropdown.insertBefore(quickNewScheduleBtn);
};
