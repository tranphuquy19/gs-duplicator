import { gitlabSvgIconUrl } from '@/config';
import $ from 'jquery/dist/jquery.slim';

export function GitlabSelectionComponent(
  options: string[],
  selectedValue: string,
  data_testId: string,
  data_qaSelector: string,
  action: (value: string) => void
) {
  const gitlabSelectionHtml = `
  <div class="select-wrapper gl-relative gl-w-full">
    <select class="js-ci-variable-input-variable-type form-control select-control"
            data-testid="${data_testId}"
            data-qa-selector="${data_qaSelector}">
      ${options.map((option) => {
        return `<option ${
          option === selectedValue ? 'selected="selected"' : ''
        } value="${option}">${option}</option>`;
      })}
    </select>
    <svg data-testid="chevron-down-icon"
         role="img"
         aria-hidden="true"
         class="gl-absolute gl-right-3 gl-top-3 gl-text-gray-500 gl-icon s16 gl-fill-current"
         data-hidden="true">
      <use href="${gitlabSvgIconUrl}#chevron-down"></use>
    </svg>
  </div>
`;

  const gitlabSelectionJObject = $(gitlabSelectionHtml);
  gitlabSelectionJObject.change(function () {
    action($(this).val() as string);
  });
  return gitlabSelectionJObject;
}
