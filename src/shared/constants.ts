export enum GetTheOptionsFrom {
  VAR_DESCRIPTION = 'var_description',
  GITLAB_VARIABLE_OPTIONS = 'gitlab_variable_options',
  MERGE_BOTH = 'merge_both',
}

// Define selectors of EditPipelineSchedulePage component
export const EDIT_PIPELINE_SCHEDULE_PAGE_SELECTORS = {
  ROW_CONTAINER: 'fieldset > div > div', // parent of CI_VARIABLE_ROW(s)
  REVEAL_VALUES_BTN: 'button[data-testid="variable-security-btn"]',
  SUBMIT_BTN: 'button[data-testid="schedule-submit-button"]',
  BRANCH_SELECT: 'div[id="schedule-target-branch-tag"]',

  CI_VARIABLE_ROW: 'div[data-testid="ci-variable-row"]',
  VARIABLE_KEY_INPUT: 'input[data-testid="pipeline-form-ci-variable-key"]',
  VARIABLE_SECRET_HIDDEN_INPUT: 'textarea[data-testid="pipeline-form-ci-variable-hidden-value"]',
  VARIABLE_SECRET_INPUT_CLASS: 'pipeline-form-ci-variable-value',
  VARIABLE_SECRET_INPUT: `:is(textarea, select)[data-testid="pipeline-form-ci-variable-value"]`,
  REMOVE_VARIABLE_BTN: 'button[data-testid="remove-ci-variable-row"]',
};
