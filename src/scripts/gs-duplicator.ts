import $ from "jquery";

import { GitlabClient, getGitlabScheduleId } from "@/shared";
import { DuplicateBtnComponent } from "@/components";
import { DownloadEnvBtnComponent } from "@/components/download-env-btn.component";

const main = async () => {
	const glClient = new GitlabClient();
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
};

(async () => {
	try {
		main();
	} catch (error) {
		console.error(error);
	}
})();

export { };
