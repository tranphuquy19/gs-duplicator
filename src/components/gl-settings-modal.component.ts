import $ from 'jquery/dist/jquery.slim';

import {
  autoShowDropDown,
  enableMarkdownVarDescription,
  getTheOptionsFrom,
  gitlabDefaultPipelineSchedule,
  gitlabRestPerPage,
  gitlabSvgIconUrl,
  gitlabToken,
  includeAllVariables,
  sortVarByName,
  wrappedVarBy,
  replaceEnterWithN,
} from '@/config';
import { GetTheOptionsFrom } from '@/shared';
import { GitlabDefaultPipelineSchedule, GitlabToolSettings } from '@/types';

export function GitlabToolSettingsModalComponent(
  cbEvent: (eventType: string, payload: any) => void
) {
  const modalHtml = `<div style="position: absolute; z-index: 1040;">
	<div role="dialog" aria-label="Gitlab Tool Settings" class="modal show gl-modal" aria-modal="true"
		style="display: flex;">
		<div class="modal-dialog modal-md modal-dialog-scrollable">
			<span tabindex="0" />
			<div tabindex="-1" class="modal-content">
				<header class="modal-header">
					<h4 class="modal-title">Gitlab Tool Settings</h4>
					<button aria-label="Close" type="button"
						class="btn btn-default btn-sm gl-button btn-default-tertiary btn-icon js-modal-action-close">
						<svg data-testid="close-icon" role="img" aria-hidden="true" class="gl-button-icon gl-icon s16">
							<use href="${gitlabSvgIconUrl}#close" />
						</svg>
					</button>
				</header>
				<div class="modal-body" style="height: 60vh;">
					<form class="">
						<div class="separator" style="margin-top:0;">Gitlab API Settings</div>
						<div role="group" class="form-group gl-form-group">
							<label for="input-1" class="d-block col-form-label">Gitlab token:</label>
							<div>
								<div role="group" class="input-group">
									<div class="input-group-prepend">
										<div class="input-group-text">Token</div>
									</div>
									<input id="i-gitlab-token" type="password" class="form-control gl-form-input" aria-label="">
								</div>
								<div class="gl-alert gl-alert-warning mt-1">
									<svg data-testid="warning-icon" role="img" aria-hidden="true" class="gl-icon s16 gl-alert-icon">
										<use href="${gitlabSvgIconUrl}#warning"></use>
									</svg>
									<div role="alert" aria-live="assertive" class="gl-alert-content">
										<h2 class="gl-alert-title">Warning</h2>
										<div class="gl-alert-body"> Do not share your token with anyone. <br> Access to the \`api\` with
											read/write permission is mandatory for the token!!! </div>
									</div>
								</div>
								<span class="form-text text-gl-muted">Don't have a token? <a
										href="https://gitlab.com/-/profile/personal_access_tokens" target="_blank">Create one</a>
								</span>
							</div>
							<div role="group" class="form-group gl-form-group mt-1">
								<label for="i-gitlab-rest-per-page" class="d-block col-form-label"> Number of items per page: </label>
								<div>
									<input id="i-gitlab-rest-per-page" type="number" placeholder="50" required="required"
										aria-required="true" class="gl-form-input form-control">
								</div>
							</div>
						</div>
						<div class="separator">Download ENV vars file Settings</div>
						<div role="group" class="form-group gl-form-group">
							<label for="i-wrap-var-value" class="d-block col-form-label"> Wrap the variable value with: </label>
							<div>
								<select id="i-wrap-the-variable-value-with" required="required" aria-required="true"
									class="gl-form-select custom-select">
									<option value="none">None</option>
									<option value="single_quotation_mark">Single quotation mark <b>'</b>
									</option>
									<option value="double_quotation_mark">Double quotation mark <b>"</b>
									</option>
								</select>
							</div>
							<small class="form-text text-gl-muted">Wrap the variable value in the ENV vars download file. Example:
								<span style="color: dimgray;">VAR_X='abc'</span> or <span style="color: dimgray;">VAR_X="abc"</span>,
								etc. </small>
						</div>
						<div role="group" class="form-group gl-form-group mb-1"
							title="Including variables defined in .gitlab-ci.yml. See: https://docs.gitlab.com/ee/api/graphql/reference/#ciconfigvariable">
							<div class="gl-form-checkbox custom-control custom-checkbox">
								<input id="i-include-all-variables" type="checkbox" name="checkboxes-4" class="custom-control-input"
									value="squash">
								<label for="i-include-all-variables" class="custom-control-label">Include all variables </label>
							</div>
						</div>
						<div role="group" class="form-group gl-form-group mb-1">
							<div class="gl-form-checkbox custom-control custom-checkbox">
								<input id="i-replace-enter-with-n" type="checkbox" name="checkboxes-8" class="custom-control-input"
									value="squash">
								<label for="i-replace-enter-with-n" class="custom-control-label">Replace enter with <code>\\n</code>
								</label>
							</div>
						</div>
						<div class="separator">Schedule page Settings</div>
						<div role="group" class="form-group gl-form-group">
							<label for="i-wrap-var-value" class="d-block col-form-label"
								title="Choose to take options from variable description or from Gitlab variable options (defined in .gitlab-ci.yml) or both.">
								Get the options from: </label>
							<div>
								<select id="i-get-the-options-from" required="required" aria-required="true"
									class="gl-form-select custom-select">
									<option value="var_description">Variable description</option>
									<option value="gitlab_variable_options"
										title="See: https://docs.gitlab.com/ee/ci/yaml/#variablesoptions">Gitlab variable options</option>
									<option value="merge_both">Merge both</option>
								</select>
							</div>
							<small class="form-text text-gl-muted">Choose to take options from variable description or from Gitlab variable options (defined in .gitlab-ci.yml, see: <a
								href="https://docs.gitlab.com/ee/ci/yaml/#variablesoptions" target="_blank">Gitlab variable options</a>) or both.
							</small>
						</div>
						<div role="group" class="form-group gl-form-group mb-1">
							<div class="gl-form-checkbox custom-control custom-checkbox">
								<input id="i-schedule-page-auto-show-dropdown" type="checkbox" name="checkboxes-5"
									class="custom-control-input" value="squash">
								<label for="i-schedule-page-auto-show-dropdown" class="custom-control-label">Auto show dropdown(s)
								</label>
							</div>
						</div>
						<div role="group" class="form-group gl-form-group mb-1">
							<div class="gl-form-checkbox custom-control custom-checkbox">
								<input id="i-enable-markdown-var-description" type="checkbox" name="checkboxes-6"
									class="custom-control-input" value="squash">
								<label for="i-enable-markdown-var-description" class="custom-control-label">Enable markdown variable
									description
								</label>
							</div>
						</div>
						<div role="group" class="form-group gl-form-group mb-1">
							<div class="gl-form-checkbox custom-control custom-checkbox">
								<input id="i-sort-var-by-name" type="checkbox" name="checkboxes-7" class="custom-control-input"
									value="squash">
								<label for="i-sort-var-by-name" class="custom-control-label">Sort variables by name (A-Z)
								</label>
							</div>
						</div>
						<div class="separator">Default new Schedule Settings</div>
						<div role="group" class="form-group gl-form-group">
							<label for="i-default-schedule-description" class="d-block col-form-label"> Description: </label>
							<div>
								<input id="i-default-schedule-description" type="text" placeholder="default schedule description"
									required="required" aria-required="true" class="gl-form-input form-control">
							</div>
						</div>
						<div role="group" class="form-group gl-form-group">
							<label for="i-default-schedule-interval-pattern" class="d-block col-form-label"> Interval pattern:
							</label>
							<div>
								<input id="i-default-schedule-interval-pattern" type="text" placeholder="0 15 * * *" required="required"
									aria-required="true" class="gl-form-input form-control">
							</div>
						</div>
						<div role="group" class="form-group gl-form-group">
							<label for="i-default-schedule-cron-timezone" class="d-block col-form-label"> Cron timezone: </label>
							<div>
								<input id="i-default-schedule-cron-timezone" type="text" placeholder="UTC" required="required"
									aria-required="true" class="gl-form-input form-control">
							</div>
						</div>
						<div role="group" class="form-group gl-form-group">
							<label for="i-default-schedule-target-branch" class="d-block col-form-label"> Target branch: </label>
							<div>
								<input id="i-default-schedule-target-branch" type="text" placeholder="main" required="required"
									aria-required="true" class="gl-form-input form-control">
							</div>
						</div>
						<div role="group" class="form-group gl-form-group">
							<div class="gl-form-checkbox custom-control custom-checkbox">
								<input id="i-default-schedule-active-by-default" type="checkbox" name="checkboxes-4"
									class="custom-control-input" value="squash">
								<label for="i-default-schedule-active-by-default" class="custom-control-label">Active by default
								</label>
							</div>
						</div>
					</form>
				</div>
				<footer class="modal-footer">
					<button type="button" class="btn js-modal-action-cancel btn-default btn-md gl-button">
						<span class="gl-button-text">Cancel</span>
					</button>
					<button type="button"
						class="btn js-modal-action-secondary btn-confirm btn-md gl-button btn-confirm-secondary">
						<span class="gl-button-text">Discard Changes</span>
					</button>
					<button type="button" class="btn js-modal-action-primary btn-confirm btn-md gl-button">
						<span class="gl-button-text">Okay</span>
					</button>
				</footer>
			</div>
			<span tabindex="0" />
		</div>
	</div>
	<div class="modal-backdrop" />
</div>
`;
  const modalJObject = $(modalHtml);

  // Inject the values to the modal
  const updateData = () => {
    // Gitlab token
    modalJObject.find('#i-gitlab-token').val(gitlabToken);
    modalJObject.find('#i-gitlab-rest-per-page').val(gitlabRestPerPage);

    // wrap the variable value with
    switch (wrappedVarBy) {
      case '':
        modalJObject.find('select#i-wrap-the-variable-value-with').val('none');
        break;
      case "'":
        modalJObject.find('select#i-wrap-the-variable-value-with').val('single_quotation_mark');
        break;
      case '"':
        modalJObject.find('select#i-wrap-the-variable-value-with').val('double_quotation_mark');
        break;
      default:
        modalJObject.find('select#i-wrap-the-variable-value-with').val('none');
        break;
    }
    modalJObject.find('#i-include-all-variables').prop('checked', includeAllVariables);
    modalJObject.find('#i-get-the-options-from').val(getTheOptionsFrom);
    modalJObject.find('#i-schedule-page-auto-show-dropdown').prop('checked', autoShowDropDown);
    modalJObject
      .find('#i-enable-markdown-var-description')
      .prop('checked', enableMarkdownVarDescription);
    modalJObject.find('#i-sort-var-by-name').prop('checked', sortVarByName);
    modalJObject.find('#i-replace-enter-with-n').prop('checked', replaceEnterWithN);

    const { active, cron, description, cron_timezone, ref } = gitlabDefaultPipelineSchedule;
    modalJObject.find('#i-default-schedule-description').val(description);
    modalJObject.find('#i-default-schedule-interval-pattern').val(cron);
    modalJObject.find('#i-default-schedule-cron-timezone').val(cron_timezone);
    modalJObject.find('#i-default-schedule-target-branch').val(ref);
    modalJObject.find('#i-default-schedule-active-by-default').prop('checked', active);

    modalJObject.find('#i-include-all-variables').prop('checked', includeAllVariables);
  };

  updateData();

  // Get the values from the modal
  const getValues = (): [string, Partial<GitlabToolSettings>] => {
    const gitlabToken = modalJObject.find('#i-gitlab-token').val()?.toString() || '';
    const gitlabRestPerPage = parseInt(
      modalJObject.find('#i-gitlab-rest-per-page').val()?.toString() || '50'
    );
    const wrappedVarByOption = modalJObject.find('select#i-wrap-the-variable-value-with').val();
    let wrappedVarBy = '';
    switch (wrappedVarByOption) {
      case 'none':
        wrappedVarBy = '';
        break;
      case 'single_quotation_mark':
        wrappedVarBy = "'";
        break;
      case 'double_quotation_mark':
        wrappedVarBy = '"';
        break;
      default:
        wrappedVarBy = '';
        break;
    }
    const getTheOptionsFromOption = modalJObject.find('select#i-get-the-options-from').val();
    let getTheOptionsFrom = GetTheOptionsFrom.VAR_DESCRIPTION;
    switch (getTheOptionsFromOption) {
      case 'var_description':
        getTheOptionsFrom = GetTheOptionsFrom.VAR_DESCRIPTION;
        break;
      case 'gitlab_variable_options':
        getTheOptionsFrom = GetTheOptionsFrom.GITLAB_VARIABLE_OPTIONS;
        break;
      case 'merge_both':
        getTheOptionsFrom = GetTheOptionsFrom.MERGE_BOTH;
        break;
      default:
        getTheOptionsFrom = GetTheOptionsFrom.VAR_DESCRIPTION;
        break;
    }
    const autoShowDropDown = modalJObject
      .find('#i-schedule-page-auto-show-dropdown')
      .prop('checked');
    const enableMarkdownVarDescription = modalJObject
      .find('#i-enable-markdown-var-description')
      .prop('checked');
    const sortVarByName = modalJObject.find('#i-sort-var-by-name').prop('checked');
    const includeAllVariables = modalJObject.find('#i-include-all-variables').prop('checked');
    const replaceEnterWithN = modalJObject.find('#i-replace-enter-with-n').prop('checked');
    const gitlabDefaultPipelineSchedule: GitlabDefaultPipelineSchedule = {
      active: modalJObject.find('#i-default-schedule-active-by-default').prop('checked'),
      cron:
        modalJObject.find('#i-default-schedule-interval-pattern').val()?.toString() || '0 15 * * *',
      description:
        modalJObject.find('#i-default-schedule-description').val()?.toString() ||
        'Default schedule',
      cron_timezone:
        modalJObject.find('#i-default-schedule-cron-timezone').val()?.toString() || 'UTC',
      ref: modalJObject.find('#i-default-schedule-target-branch').val()?.toString() || 'main',
    };
    return [
      gitlabToken,
      {
        gitlabRestPerPage,
        wrappedVarBy,
        includeAllVariables,
        gitlabDefaultPipelineSchedule,
        getTheOptionsFrom,
        autoShowDropDown,
        enableMarkdownVarDescription,
        sortVarByName,
        replaceEnterWithN,
      },
    ];
  };

  modalJObject.find('.js-modal-action-cancel').on('click', function () {
    cbEvent('cancel', null);
  });
  modalJObject.find('.js-modal-action-secondary').on('click', function () {
    updateData();
  });
  modalJObject.find('.js-modal-action-primary').on('click', function () {
    cbEvent('okay', getValues());
  });
  modalJObject.find('.js-modal-action-close').on('click', function () {
    cbEvent('close', null);
  });
  // outside click
  modalJObject.find('.modal').on('click', function (e) {
    if (e.target === this) {
      cbEvent('discard', null);
    }
  });
  return modalJObject;
}
