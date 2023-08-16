import $ from 'jquery/dist/jquery.slim';

export function GitlabSelectionComponent(
  options: string[],
  selectedValue: string,
  data_testId: string,
  data_qaSelector: string,
  action: (value: string) => void
) {
  const gitlabSelectionHtml = `
	<select class="js-ci-variable-input-variable-type form-control select-control custom-select table-section" data-testid=${data_testId} data-qa-selector=${data_qaSelector}>
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
