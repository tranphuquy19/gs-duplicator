import $ from 'jquery/dist/jquery.slim';

import { gitlabSvgIconUrl } from '@/config';

export function GitlabRemoveVariableRowComponent() {
  const removeBtnHtml = `
	<button data-testid="remove-ci-variable-row" aria-label="Remove variable" type="button" class="btn gl-md-ml-3 gl-mb-3 custom-remove-variable-btn btn-danger btn-md gl-button btn-danger-secondary btn-icon">
		<svg data-testid="clear-icon" role="img" aria-hidden="true" class="gl-button-icon gl-icon s16">
			<use href="${gitlabSvgIconUrl}#clear">
			</use>
		</svg>
	</button>`;
  return $(removeBtnHtml);
}
