import $ from 'jquery/dist/jquery.slim';

import {
  gitlabSvgIconUrl,
  gitlabDefaultPipelineSchedule,
  wrappedVarBy,
  gitlabToken,
  includeAllVariables,
  gitlabRestPerPage,
} from '@/config';
import { GitlabDefaultPipelineSchedule, GitlabToolSettings } from '@/types';

export function GitlabToolSettingsModalComponent(
  cbEvent: (eventType: string, payload: any) => void
) {
  const modalHtml = `<div style="position: absolute; z-index: 1040;">
  <div role="dialog" aria-label="Gitlab Tool Settings" class="modal show gl-modal" aria-modal="true" style="display: flex;">
    <div class="modal-dialog modal-md modal-dialog-scrollable">
      <span tabindex="0" />
      <div tabindex="-1" class="modal-content">
        <header class="modal-header">
          <h4 class="modal-title">Gitlab Tool Settings</h4>
          <button aria-label="Close" type="button" class="btn btn-default btn-sm gl-button btn-default-tertiary btn-icon js-modal-action-close">
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
                    <div class="gl-alert-body"> Do not share your token with anyone. <br> Access to the \`api\` with read/write permission is mandatory for the token!!! </div>
                  </div>
                </div>
                <span class="form-text text-gl-muted">Don't have a token? <a href="https://gitlab.com/-/profile/personal_access_tokens" target="_blank">Create one</a>
                </span>
              </div>
              <div role="group" class="form-group gl-form-group mt-1">
                <label for="i-gitlab-rest-per-page" class="d-block col-form-label"> Number of items per page: </label>
                <div>
                  <input id="i-gitlab-rest-per-page" type="number" placeholder="50" required="required" aria-required="true" class="gl-form-input form-control">
                </div>
              </div>
            </div>
            <div class="separator">Download ENV vars file Settings</div>
            <div role="group" class="form-group gl-form-group">
              <label for="i-wrap-var-value" class="d-block col-form-label"> Wrap the variable value with: </label>
              <div>
                <select required="required" aria-required="true" class="gl-form-select custom-select">
                  <option value="none">None</option>
                  <option value="single_quotation_mark">Single quotation mark <b>'</b>
                  </option>
                  <option value="double_quotation_mark">Double quotation mark <b>"</b>
                  </option>
                </select>
              </div>
              <small class="form-text text-gl-muted">Wrap the variable value in the ENV vars download file. Example: <span style="color: dimgray;">VAR_X='abc'</span> or <span style="color: dimgray;">VAR_X="abc"</span>, etc. </small>
            </div>
            <div role="group" class="form-group gl-form-group">
              <div class="gl-form-checkbox custom-control custom-checkbox">
                <input id="i-include-all-variables" type="checkbox" name="checkboxes-4" class="custom-control-input" value="squash">
                <label for="i-include-all-variables" class="custom-control-label">Include all variables </label>
              </div>
            </div>
            <div class="separator">Default new Schedule Settings</div>
            <div role="group" class="form-group gl-form-group">
              <label for="i-default-schedule-description" class="d-block col-form-label"> Description: </label>
              <div>
                <input id="i-default-schedule-description" type="text" placeholder="default schedule description" required="required" aria-required="true" class="gl-form-input form-control">
              </div>
            </div>
            <div role="group" class="form-group gl-form-group">
              <label for="i-default-schedule-interval-pattern" class="d-block col-form-label"> Interval pattern: </label>
              <div>
                <input id="i-default-schedule-interval-pattern" type="text" placeholder="0 15 * * *" required="required" aria-required="true" class="gl-form-input form-control">
              </div>
            </div>
            <div role="group" class="form-group gl-form-group">
              <label for="i-default-schedule-cron-timezone" class="d-block col-form-label"> Cron timezone: </label>
              <div>
                <input id="i-default-schedule-cron-timezone" type="text" placeholder="UTC" required="required" aria-required="true" class="gl-form-input form-control">
              </div>
            </div>
            <div role="group" class="form-group gl-form-group">
              <label for="i-default-schedule-target-branch" class="d-block col-form-label"> Target branch: </label>
              <div>
                <input id="i-default-schedule-target-branch" type="text" placeholder="main" required="required" aria-required="true" class="gl-form-input form-control">
              </div>
            </div>
            <div role="group" class="form-group gl-form-group">
              <div class="gl-form-checkbox custom-control custom-checkbox">
                <input id="i-default-schedule-active-by-default" type="checkbox" name="checkboxes-4" class="custom-control-input" value="squash">
                <label for="i-default-schedule-active-by-default" class="custom-control-label">Active by default </label>
              </div>
            </div>
          </form>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn js-modal-action-cancel btn-default btn-md gl-button">
            <span class="gl-button-text">Cancel</span>
          </button>
          <button type="button" class="btn js-modal-action-secondary btn-confirm btn-md gl-button btn-confirm-secondary">
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
</div>`;
  const modalJObject = $(modalHtml);

  // Inject the values to the modal
  const updateData = () => {
    // Gitlab token
    modalJObject.find('#i-gitlab-token').val(gitlabToken);
    modalJObject.find('#i-gitlab-rest-per-page').val(gitlabRestPerPage);

    // wrap the variable value with
    switch (wrappedVarBy) {
      case '':
        modalJObject.find('select').val('none');
        break;
      case "'":
        modalJObject.find('select').val('single_quotation_mark');
        break;
      case '"':
        modalJObject.find('select').val('double_quotation_mark');
        break;
      default:
        modalJObject.find('select').val('none');
        break;
    }
    modalJObject.find('#i-include-all-variables').prop('checked', includeAllVariables);

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
    const wrappedVarByOption = modalJObject.find('select').val();
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
    const includeAllVariables = modalJObject.find('#i-include-all-variables').prop('checked');
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
