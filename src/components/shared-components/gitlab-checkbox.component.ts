import $ from 'jquery/dist/jquery.slim';

export function GitlabCheckboxComponent(
  label: string,
  controlLabel: string,
  className: string | null,
  checked = true,
  checkboxId?: string
) {
  const _checkboxId = checkboxId ?? label.replaceAll(' ', '') + '_checkbox';
  const checkboxComponentHtml = `
	<div class="${className ?? 'col-md-2'}">
		<label class="label-bold" for="${_checkboxId}">${label}</label>
		<div>
			<div class="gl-form-checkbox custom-control custom-checkbox">
				<input class="custom-control-input" type="checkbox" id="${_checkboxId}" ${checked ? 'checked' : ''}>
				<label class="custom-control-label" for="${_checkboxId}"><span>${controlLabel}</span></label>
			</div>
		</div>
	</div>
	`;
  return $(checkboxComponentHtml);
}
