import { GitlabScheduleVariable } from "@/types";

function saveAs(blob: Blob, filename: string): void {
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}

export function downloadEnvFile(variables: GitlabScheduleVariable[], description: string): void {
	const envFileContent = variables
		.map((variable) => `${variable.key}="${variable.value}"`)
		.join("\n");
	const blob = new Blob([envFileContent], { type: "text/plain;charset=utf-8" });
	saveAs(blob, `${description}.env`);
}
