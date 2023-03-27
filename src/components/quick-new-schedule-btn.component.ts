import $ from 'jquery/dist/jquery.slim';

export function QuickNewScheduleBtnComponent() {
  const quickNewScheduleBtnHtml = `
	<a class="btn gl-button btn-success">
		<span>Quick new schedule</span>
	</a>`;
  const quickNewScheduleBtnJObject = $(quickNewScheduleBtnHtml);
  quickNewScheduleBtnJObject.on('click', function () {
    $(`#gs-dropdown-choose-branch`).toggle();
  });
  return quickNewScheduleBtnJObject;
}
