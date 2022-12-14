import { gitlabDefaultPipelineSchedule } from "@/config";
import { GitlabGraphqlClient, GitlabHttpClient } from "@/shared";
import { DropdownItem } from "@/types";
import { GitlabDropdownComponent } from "./shared-components";

export async function ChooseBranchDropdownComponent() {
	const glClient = GitlabHttpClient.getInstance();
	const glGraphqlClient = GitlabGraphqlClient.getInstance();

	const branches = await glClient.getProjectBranches();
	const dropdownItems = branches?.map<DropdownItem>((branchName) => ({
		text: branchName,
		fn: async () => {
			const fullPathRegex = /\/(.*?)\/-\/pipeline_schedules/;
			const fullPathMatch = window.location.pathname.match(fullPathRegex);
			const fullPath = fullPathMatch ? fullPathMatch[1] : "";
			if (fullPath) {
				// const vars = await glClient.getCiConfigVariables(fullPath, `refs/heads/${branchName}`) as GitlabScheduleVariable[] || [];
				const vars = await glGraphqlClient.getCiConfigVariables(fullPath, `refs/heads/${branchName}`);
				if (!vars) return;

				const newPipelineSchedule = await glClient.createPipelineSchedule({
					...gitlabDefaultPipelineSchedule,
					ref: branchName,
				});
				await Promise.all(vars.map((_var) => (glClient.createPipelineScheduleVariable(newPipelineSchedule?.id, _var))));
				if (!!newPipelineSchedule && confirm(`Create schedule success! Go to the edit page?`)) {
					window.location.href = `${window.location.href}/${newPipelineSchedule?.id}/edit`;
				} else {
					window.location.reload();
				}
			}
		},
	}));

	return GitlabDropdownComponent('choose-branch', 'Copy vars from branch', dropdownItems || [{ text: 'No branches found', fn: () => { } }]);
}
