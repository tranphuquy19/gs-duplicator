import $ from "jquery";

export function QuickNewScheduleBtnComponent() {
	const quickNewScheduleBtnHtml = `
	<a class="btn gl-button btn-success">
		<span>Quick new schedule</span>
	</a>`;
	const quickNewScheduleBtnJObject = $(quickNewScheduleBtnHtml);
	quickNewScheduleBtnJObject.click(async () => {
		$(`#gs-dropdown-choose-branch`).show();
	});
	return quickNewScheduleBtnJObject;
}
