import $ from 'jquery/dist/jquery.slim';

export function GitlabSelectionComponent(
  options: string[],
  selectedValue: string,
  componentName: string,
  action: (value: string) => void
) {
  const gitlabSelectionHtml = `
	<select class="js-ci-variable-input-variable-type ci-variable-body-item form-control select-control custom-select table-section" name=${componentName}>
		${options.map((option) => {
      return `<option ${
        option === selectedValue ? 'selected="selected"' : ''
      } value="${option}">${option}</option>`;
    })}
	</select>`;

  const gitlabSelectionJObject = $(gitlabSelectionHtml);
  gitlabSelectionJObject.change(function () {
    action($(this).val() as string);
  });
  return gitlabSelectionJObject;
}
