import $ from "jquery";

import { ChooseBranchDropdownComponent, DownloadEnvBtnComponent, DuplicateBtnComponent, QuickNewScheduleBtnComponent } from "@/components";
import { getGitlabScheduleId } from "@/shared";

const main = async () => {
	const btnGroup = $(".float-right.btn-group");

	// find the buttons with attribute title="Edit" in the btnGroup
	const editBtns = btnGroup.find("[title='Edit']");
	for (const btnItem of editBtns) {
		const editBtn = $(btnItem);
		const editBtnHref = editBtn.attr("href");
		const scheduleId = getGitlabScheduleId(editBtnHref);
		const duplicateBtn = DuplicateBtnComponent(scheduleId);
		if (duplicateBtn) {
			duplicateBtn.insertBefore(editBtn);
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
