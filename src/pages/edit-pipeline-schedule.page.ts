import {
  GitlabCheckboxComponent,
  GitlabRemoveVariableRowComponent,
  GitlabSelectionComponent,
  VarDescriptionComponent,
} from '@/components';
import { getTheOptionsFrom } from '@/config';
import {
  $,
  GetTheOptionsFrom,
  GitlabGraphqlClient,
  VarOptionStorage,
  convertMarkdownToHtml,
  getOptionsFromVarDescription,
  getProjectFullPath,
  getScheduleIdFromUrl,
  waitForElement,
  EDIT_PIPELINE_SCHEDULE_PAGE_SELECTORS,
} from '@/shared';
import {
  GitlabEditVarRow,
  GitlabScheduleVariableTypes,
  UpdatePipelineSchedule,
  UpdatePipelineScheduleVariable,
} from '@/types';

const {
  ROW_CONTAINER,
  REVEAL_VALUES_BTN,
  SUBMIT_BTN,
  BRANCH_SELECT,
  CI_VARIABLE_ROW,
  VARIABLE_KEY_INPUT,
  VARIABLE_SECRET_INPUT,
  // VARIABLE_SECRET_HIDDEN_INPUT,
  REMOVE_VARIABLE_BTN,
} = EDIT_PIPELINE_SCHEDULE_PAGE_SELECTORS;

const getPersistedVariables = () => {
  let persistedVariables: JQuery<HTMLElement> | HTMLElement[] = $(ROW_CONTAINER);
  if (persistedVariables.length === 0) {
    console.error('[GitLab Duplicator]-persistedVariables is empty');
  } else {
    // remove last persistedVariables item from array
    persistedVariables = Array.from(persistedVariables).slice(0, -1);
  }
  return persistedVariables;
};

export const editPipelineSchedulePage = async () => {
  const isShowDropdown = true;

  const varOptionStorage = VarOptionStorage.getInstance();
  const glGraphqlClient = GitlabGraphqlClient.getInstance();

  // wait for the page to be rendered
  console.info('Waiting for the page to be rendered');
  await Promise.all([
    waitForElement(ROW_CONTAINER),
    waitForElement(REVEAL_VALUES_BTN),
    waitForElement(SUBMIT_BTN),
    waitForElement(BRANCH_SELECT),
  ]);
  console.info('Page is rendered');

  const revealValuesBtn = $(REVEAL_VALUES_BTN);

  // $('.ci-variable-row-remove-button').css({ 'margin-left': '3rem' });

  const editPipelineScheduleBtn = $(SUBMIT_BTN);
  editPipelineScheduleBtn.hide();
  const newEditPipelineScheduleBtn = $(
    '<button type="button" class="btn btn-confirm btn-md gl-button">Edit pipeline schedule</button>'
  );
  newEditPipelineScheduleBtn.insertAfter(editPipelineScheduleBtn);

  const currentBranch = $(BRANCH_SELECT).find('button').first().text().trim();

  if (revealValuesBtn) {
    revealValuesBtn.trigger('click');
  }

  const fullPath = getProjectFullPath(window.location.pathname as string);
  const ciConfigVariables =
    (await glGraphqlClient.getCiConfigVariables(fullPath, `refs/heads/${currentBranch}`)) || [];

  const descriptionOption: { [key: string]: string[] } = {};
  for (const ciConfigVar of ciConfigVariables) {
    const varOptions = getOptionsFromVarDescription(ciConfigVar.description);

    if (getTheOptionsFrom === GetTheOptionsFrom.VAR_DESCRIPTION) {
      if (varOptions.length > 0) {
        descriptionOption[ciConfigVar.key] = getOptionsFromVarDescription(ciConfigVar.description);
      }
    } else if (getTheOptionsFrom === GetTheOptionsFrom.GITLAB_VARIABLE_OPTIONS) {
      if (!!ciConfigVar.valueOptions && ciConfigVar.valueOptions.length > 0) {
        descriptionOption[ciConfigVar.key] = ciConfigVar.valueOptions;
      }
    } else if (getTheOptionsFrom === GetTheOptionsFrom.MERGE_BOTH) {
      if (
        varOptions.length > 0 ||
        (!!ciConfigVar.valueOptions && ciConfigVar.valueOptions.length > 0)
      ) {
        const glValueOptions = ciConfigVar.valueOptions || [];
        // create a set to remove duplicate values
        const mergedOptions = new Set([
          ...getOptionsFromVarDescription(ciConfigVar.description),
          ...glValueOptions,
        ]);

        descriptionOption[ciConfigVar.key] = Array.from(mergedOptions);
      }
    }
  }
  await varOptionStorage.setOptions(descriptionOption);
  const keyOptions = varOptionStorage.getOptions();

  const persistedVariables = getPersistedVariables();

  // Activated checkbox
  const checkBoxRow = $('.gl-form-checkbox.gl-mb-3.custom-control.custom-checkbox');

  const showValueOptionsDropdownCheckbox = GitlabCheckboxComponent(
    'Show dropdown(s)',
    'Turn on',
    'pl-0',
    isShowDropdown,
    'show_dropdown_checkbox'
  );
  showValueOptionsDropdownCheckbox.insertAfter(checkBoxRow);

  const _rows: GitlabEditVarRow[] = [];

  for (const persistedVariable of persistedVariables) {
    const persistedVariableRow = $(persistedVariable);
    persistedVariableRow.find(CI_VARIABLE_ROW).removeClass('gl-mb-3 gl-pb-2');

    //#region Get components
    const variableTypeSelect = persistedVariableRow.find(
      'button.btn.dropdown-toggle.gl-dropdown-toggle'
    );

    const variableType = variableTypeSelect.text().trim() as GitlabScheduleVariableTypes;

    const variableKeyInput = persistedVariableRow.find(VARIABLE_KEY_INPUT);

    const variableKey = variableKeyInput.val() as string;

    const variableSecretValueInput = persistedVariableRow.find(VARIABLE_SECRET_INPUT);

    const variableSecretValue = variableSecretValueInput.val() as string;

    const removeVariableBtn = persistedVariableRow.find(REMOVE_VARIABLE_BTN);
    removeVariableBtn.addClass('origin-remove-variable-btn');

    removeVariableBtn.hide();
    const newRemoveVariableBtn = GitlabRemoveVariableRowComponent();
    newRemoveVariableBtn.insertAfter(removeVariableBtn);
    newRemoveVariableBtn.on('click', () => {
      persistedVariableRow.remove();
    });

    //#endregion

    //#region Adding var description
    const descriptionTxt = ciConfigVariables.find((v) => v.key === variableKey)?.description;
    if (descriptionTxt) {
      const varDescriptionComponent = VarDescriptionComponent(
        convertMarkdownToHtml(descriptionTxt)
      );
      removeVariableBtn.on('click', () => {
        varDescriptionComponent.remove();
      });
      // varDescriptionComponent.insertAfter(persistedVariableRow.find('.ci-variable-row'));
      persistedVariableRow.append(varDescriptionComponent);
    } else {
      persistedVariableRow.find(CI_VARIABLE_ROW).attr('style', 'padding-bottom: 16px;');
    }
    //#endregion

    // if variableSecretValue is not in the list of options, add it to the list
    if (keyOptions[variableKey]?.indexOf(variableSecretValue) === -1) {
      keyOptions[variableKey]?.push(variableSecretValue);
    }

    let variableSecretValueDropdown: JQuery<HTMLElement> | null = null;
    if ((keyOptions[variableKey] || []).length > 0) {
      variableSecretValueDropdown = GitlabSelectionComponent(
        keyOptions[variableKey] || [],
        variableSecretValue,
        'pipeline-form-ci-variable-value',
        'ci_variable_value_field',
        (value) => {
          console.log('value', value);
        }
      );
    }

    _rows.push({
      key: variableKey,
      variableType,
      original: {
        valueInput: variableSecretValueInput,
      },
      clone: variableSecretValueDropdown
        ? {
            valueInput: variableSecretValueDropdown,
          }
        : null,
    });
  }

  const reloadForm = (allowShowDropdown: boolean) => {
    for (const row of _rows) {
      if (allowShowDropdown) {
        if (row.clone) {
          if (row.original.valueInput.is(':visible')) {
            // alow empty value
            const currentValue = row.original.valueInput.val() as string;
            if (keyOptions[row.key]?.indexOf(currentValue) === -1) {
              keyOptions[row.key]?.push(currentValue);
            }
            row.clone.valueInput = GitlabSelectionComponent(
              keyOptions[row.key] || [],
              currentValue,
              'pipeline-form-ci-variable-value',
              'ci_variable_value_field',
              (value) => {
                console.log('value', value);
              }
            );
            row.clone.valueInput.val(currentValue);
            row.clone.valueInput.replaceAll(row.original.valueInput);
          }
        }
      } else {
        if (row.clone) {
          if (row.clone.valueInput.is(':visible')) {
            const currentValue = row.clone.valueInput.val() as string;
            row.original.valueInput.val(currentValue);
            row.original.valueInput.replaceAll(row.clone.valueInput);
          }
        }
      }
    }
  };

  if (isShowDropdown) {
    reloadForm(isShowDropdown);
  }

  showValueOptionsDropdownCheckbox.on('click', (e) => {
    if (e.target.nodeName !== 'INPUT') return;
    else {
      const isChecked = $('#show_dropdown_checkbox').is(':checked');
      reloadForm(isChecked);
      editPipelineScheduleBtn.show();
      newEditPipelineScheduleBtn.hide();
      $('.origin-remove-variable-btn').show();
      $('.custom-remove-variable-btn').hide();
    }
  });

  //#region Reveal button click event
  revealValuesBtn.on('click', () => {
    const _isShowDropdown = $('#show_dropdown_checkbox').is(':checked');
    const isHidden = revealValuesBtn.text().includes('Reveal value');

    if (isHidden) {
      if (_isShowDropdown) {
        for (const row of _rows) {
          row.clone?.valueInput.show();
        }
      } else {
        // do nothing
      }
    } else {
      if (_isShowDropdown) {
        for (const row of _rows) {
          row.clone?.valueInput.hide();
        }
      } else {
        // do nothing
      }
    }
  });
  //#endregion

  newEditPipelineScheduleBtn.on('click', async () => {
    const updatedVariables: UpdatePipelineScheduleVariable[] = [];
    const crtPersistedVariables = getPersistedVariables();

    for (const persistedVariable of crtPersistedVariables) {
      const persistedVariableRow = $(persistedVariable);
      const variableKeyInput = persistedVariableRow.find(VARIABLE_KEY_INPUT);
      const variableKey = variableKeyInput.val() as string;

      if (variableKey === undefined) continue;

      const variableSecretValueInput = persistedVariableRow.find(VARIABLE_SECRET_INPUT);
      const variableSecretValue = variableSecretValueInput.val() as string;
      if (variableSecretValue === undefined) continue;

      updatedVariables.push({
        key: variableKey,
        value: variableSecretValue,
      });
    }

    // get last div
    const scheduleVueElement = $(
      '#content-body > div.col-lg-8.gl-pl-0'
    )?.get()[0] as HTMLDivElement & {
      __vue__?: any;
    };
    const scheduleVueInstanceData = scheduleVueElement.__vue__.$data;

    const updatedPipelineSchedule: UpdatePipelineSchedule = {
      description: scheduleVueInstanceData.description,
      cron: scheduleVueInstanceData.cron,
      cronTimezone: scheduleVueInstanceData.cronTimezone,
      ref: scheduleVueInstanceData.scheduleRef,
      activate: scheduleVueInstanceData.activated,
      variables: updatedVariables,
    };

    await glGraphqlClient.updatePipelineSchedule(
      getScheduleIdFromUrl(window.location.pathname as string),
      fullPath,
      updatedPipelineSchedule
    );
    // navigate to pipeline schedules page
    window.location.href = `${window.location.origin}/${fullPath}/-/pipeline_schedules`;
  });

  //#endregion
};
