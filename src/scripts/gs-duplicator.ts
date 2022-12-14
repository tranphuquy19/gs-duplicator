import $ from "jquery/dist/jquery.slim";

import { ChooseBranchDropdownComponent, DownloadEnvBtnComponent, DuplicateBtnComponent, QuickNewScheduleBtnComponent } from "@/components";
import { getGitlabScheduleIdFromUrl } from "@/shared";

const main = async () => {
	const btnGroup = $('.float-right.btn-group');

	// find the buttons with attribute title="Edit" in the btnGroup
	const playBtns = btnGroup.find(`[title='Play']`);
	for (const btnItem of playBtns) {
		const playBtn = $(btnItem);
		const playBtnHref = playBtn.attr('href');
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
	if (quickNewScheduleBtn) {
		quickNewScheduleBtn.insertBefore(newScheduleBtn);
	}

	const glChooseBranchDropdown = await ChooseBranchDropdownComponent();
	glChooseBranchDropdown.insertBefore(quickNewScheduleBtn);
};

(async () => {
	try {
		main();
	} catch (error) {
		console.error(error);
	}
})();

export { };
