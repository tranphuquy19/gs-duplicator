import {
  GitlabCheckboxComponent,
  GitlabSelectionComponent,
  VarDescriptionComponent,
} from '@/components';
import {
  convertMarkdownToHtml,
  getOptionsFromVarDescription,
  getProjectFullPath,
  GitlabGraphqlClient,
  VarOptionStorage,
} from '@/shared';
import { GitlabEditVarRow, GitlabScheduleVariableTypes } from '@/types';

export const editPipelineSchedulePage = async () => {
  const isShowDropdown = true;

  const varOptionStorage = VarOptionStorage.getInstance();
  const glGraphqlClient = GitlabGraphqlClient.getInstance();

  const revealValuesBtn = $('.js-secret-value-reveal-button');
  $('.ci-variable-row-remove-button').css({ 'margin-left': '3rem' });

  const currentBranch = $('div[data-testid=schedule-target-ref]')
    .find('button')
    .first()
    .text()
    .trim();

  if (revealValuesBtn) {
    revealValuesBtn.click();
  }

  const fullPath = getProjectFullPath(window.location.pathname as string);
  const ciConfigVariables =
    (await glGraphqlClient.getCiConfigVariables(fullPath, `refs/heads/${currentBranch}`)) || [];

  const descriptionOption: { [key: string]: string[] } = {};
  for (const ciConfigVar of ciConfigVariables) {
    descriptionOption[ciConfigVar.key] = getOptionsFromVarDescription(ciConfigVar.description);
  }
  await varOptionStorage.setOptions(descriptionOption);
  const keyOptions = varOptionStorage.getOptions();

  const persistedVariables = $('.js-row.ci-variable-row[data-is-persisted="true"]');
  persistedVariables
    .attr('style', 'flex-direction: column;')
    .addClass(['border-bottom', 'pb2'])
    .find('.ci-variable-row-body')
    .removeClass('border-bottom')
    .attr('style', 'padding-bottom: 4px;');

  const checkBoxRow = $('.js-pipeline-schedule-form.pipeline-schedule-form')
    .find('.form-group.row')
    .last();
  const activatedCheckboxCol = checkBoxRow.find('.col-md-9');
  activatedCheckboxCol.attr('class', 'col-md-2');

  const showValueOptionsDropdownCheckbox = GitlabCheckboxComponent(
    'Show dropdown(s)',
    'Turn on',
    'col-md-2',
    isShowDropdown,
    'show_dropdown_checkbox'
  );
  showValueOptionsDropdownCheckbox.insertAfter(activatedCheckboxCol);

  const _rows: GitlabEditVarRow[] = [];

  for (const persistedVariable of persistedVariables) {
    const persistedVariableRow = $(persistedVariable);

    //#region Get components
    const variableTypeSelect = persistedVariableRow.find(
      'select[name="schedule[variables_attributes][][variable_type]"]'
    );

    const variableType = variableTypeSelect.val() as GitlabScheduleVariableTypes;

    const variableKeyInput = persistedVariableRow.find(
      'input[name="schedule[variables_attributes][][key]"]'
    );
    const variableKey = variableKeyInput.val() as string;

    const variableSecretValueInput = persistedVariableRow.find(
      'textarea[name="schedule[variables_attributes][][secret_value]"]'
    );
    const variableSecretValue = variableSecretValueInput.val() as string;

    //#endregion

    //#region Adding var description
    const descriptionTxt = ciConfigVariables.find((v) => v.key === variableKey)?.description;
    if (descriptionTxt) {
      const varDescriptionComponent = VarDescriptionComponent(
        convertMarkdownToHtml(descriptionTxt)
      );
      varDescriptionComponent.insertAfter(persistedVariableRow.find('.ci-variable-row-body'));
    } else {
      persistedVariableRow.find('.ci-variable-row-body').attr('style', 'padding-bottom: 16px;');
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
        'schedule[variables_attributes][][secret_value]',
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

  const reloadForm = (isChecked: boolean) => {
    for (const row of _rows) {
      if (isChecked) {
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
              'schedule[variables_attributes][][secret_value]',
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

  showValueOptionsDropdownCheckbox.click((e) => {
    if (e.target.nodeName !== 'INPUT') return;
    else {
      const isChecked = $('#show_dropdown_checkbox').is(':checked');
      reloadForm(isChecked);
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
};
