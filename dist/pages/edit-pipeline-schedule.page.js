"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPipelineSchedulePage = void 0;
const components_1 = require("@/components");
const config_1 = require("@/config");
const shared_1 = require("@/shared");
const { ROW_CONTAINER, REVEAL_VALUES_BTN, SUBMIT_BTN, BRANCH_SELECT, CI_VARIABLE_ROW, VARIABLE_KEY_INPUT, VARIABLE_SECRET_INPUT, 
// VARIABLE_SECRET_HIDDEN_INPUT,
VARIABLE_SECRET_INPUT_CLASS, REMOVE_VARIABLE_BTN, } = shared_1.EDIT_PIPELINE_SCHEDULE_PAGE_SELECTORS;
const getPersistedVariables = () => {
    let persistedVariables = (0, shared_1.$)(ROW_CONTAINER);
    if (persistedVariables.length === 0) {
        console.error('[GitLab Duplicator]-persistedVariables is empty');
    }
    else {
        // remove last persistedVariables item from array
        persistedVariables = Array.from(persistedVariables).slice(0, -1);
    }
    return persistedVariables;
};
const editPipelineSchedulePage = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const isShowDropdown = true;
    const varOptionStorage = shared_1.VarOptionStorage.getInstance();
    const glGraphqlClient = shared_1.GitlabGraphqlClient.getInstance();
    // wait for the page to be rendered
    console.info('Waiting for the page to be rendered');
    yield Promise.all([
        (0, shared_1.waitForElement)(ROW_CONTAINER),
        (0, shared_1.waitForElement)(REVEAL_VALUES_BTN),
        (0, shared_1.waitForElement)(SUBMIT_BTN),
        (0, shared_1.waitForElement)(BRANCH_SELECT),
    ]);
    console.info('Page is rendered');
    const revealValuesBtn = (0, shared_1.$)(REVEAL_VALUES_BTN);
    // $('.ci-variable-row-remove-button').css({ 'margin-left': '3rem' });
    const editPipelineScheduleBtn = (0, shared_1.$)(SUBMIT_BTN);
    editPipelineScheduleBtn.hide();
    const newEditPipelineScheduleBtn = (0, shared_1.$)('<button type="button" class="btn btn-confirm btn-md gl-button">Edit pipeline schedule</button>');
    newEditPipelineScheduleBtn.insertAfter(editPipelineScheduleBtn);
    const currentBranch = (0, shared_1.$)(BRANCH_SELECT).find('button').first().text().trim();
    if (revealValuesBtn) {
        revealValuesBtn.trigger('click');
    }
    const fullPath = (0, shared_1.getProjectFullPath)(window.location.pathname);
    const ciConfigVariables = (yield glGraphqlClient.getCiConfigVariables(fullPath, `refs/heads/${currentBranch}`)) || [];
    const descriptionOption = {};
    for (const ciConfigVar of ciConfigVariables) {
        const varOptions = (0, shared_1.getOptionsFromVarDescription)(ciConfigVar.description);
        if (config_1.getTheOptionsFrom === shared_1.GetTheOptionsFrom.VAR_DESCRIPTION) {
            if (varOptions.length > 0) {
                descriptionOption[ciConfigVar.key] = (0, shared_1.getOptionsFromVarDescription)(ciConfigVar.description);
            }
        }
        else if (config_1.getTheOptionsFrom === shared_1.GetTheOptionsFrom.GITLAB_VARIABLE_OPTIONS) {
            if (!!ciConfigVar.valueOptions && ciConfigVar.valueOptions.length > 0) {
                descriptionOption[ciConfigVar.key] = ciConfigVar.valueOptions;
            }
        }
        else if (config_1.getTheOptionsFrom === shared_1.GetTheOptionsFrom.MERGE_BOTH) {
            if (varOptions.length > 0 ||
                (!!ciConfigVar.valueOptions && ciConfigVar.valueOptions.length > 0)) {
                const glValueOptions = ciConfigVar.valueOptions || [];
                // create a set to remove duplicate values
                const mergedOptions = new Set([
                    ...(0, shared_1.getOptionsFromVarDescription)(ciConfigVar.description),
                    ...glValueOptions,
                ]);
                descriptionOption[ciConfigVar.key] = Array.from(mergedOptions);
            }
        }
    }
    yield varOptionStorage.setOptions(descriptionOption);
    const keyOptions = varOptionStorage.getOptions();
    const persistedVariables = getPersistedVariables();
    // Activated checkbox
    const checkBoxRow = (0, shared_1.$)('.gl-form-checkbox.gl-mb-3.custom-control.custom-checkbox');
    const showValueOptionsDropdownCheckbox = (0, components_1.GitlabCheckboxComponent)('Show dropdown(s)', 'Turn on', 'pl-0', isShowDropdown, 'show_dropdown_checkbox');
    showValueOptionsDropdownCheckbox.insertAfter(checkBoxRow);
    const _rows = [];
    for (const persistedVariable of persistedVariables) {
        const persistedVariableRow = (0, shared_1.$)(persistedVariable);
        persistedVariableRow.find(CI_VARIABLE_ROW).removeClass('gl-mb-3 gl-pb-2');
        //#region Get components
        const variableTypeSelect = persistedVariableRow.find('button.btn.dropdown-toggle.gl-dropdown-toggle');
        const variableType = variableTypeSelect.text().trim();
        const variableKeyInput = persistedVariableRow.find(VARIABLE_KEY_INPUT);
        const variableKey = variableKeyInput.val();
        const variableSecretValueInput = persistedVariableRow.find(VARIABLE_SECRET_INPUT);
        const variableSecretValue = variableSecretValueInput.val();
        const removeVariableBtn = persistedVariableRow.find(REMOVE_VARIABLE_BTN);
        removeVariableBtn.addClass('origin-remove-variable-btn');
        removeVariableBtn.hide();
        const newRemoveVariableBtn = (0, components_1.GitlabRemoveVariableRowComponent)();
        newRemoveVariableBtn.insertAfter(removeVariableBtn);
        newRemoveVariableBtn.on('click', () => {
            persistedVariableRow.remove();
        });
        //#endregion
        //#region Adding var description
        const descriptionTxt = (_a = ciConfigVariables.find((v) => v.key === variableKey)) === null || _a === void 0 ? void 0 : _a.description;
        if (descriptionTxt) {
            const varDescriptionComponent = (0, components_1.VarDescriptionComponent)((0, shared_1.convertMarkdownToHtml)(descriptionTxt));
            removeVariableBtn.on('click', () => {
                varDescriptionComponent.remove();
            });
            // varDescriptionComponent.insertAfter(persistedVariableRow.find('.ci-variable-row'));
            persistedVariableRow.append(varDescriptionComponent);
        }
        else {
            persistedVariableRow.find(CI_VARIABLE_ROW).attr('style', 'padding-bottom: 16px;');
        }
        //#endregion
        // if variableSecretValue is not in the list of options, add it to the list
        if (((_b = keyOptions[variableKey]) === null || _b === void 0 ? void 0 : _b.indexOf(variableSecretValue)) === -1) {
            (_c = keyOptions[variableKey]) === null || _c === void 0 ? void 0 : _c.push(variableSecretValue);
        }
        let variableSecretValueDropdown = null;
        if ((keyOptions[variableKey] || []).length > 0) {
            variableSecretValueDropdown = (0, components_1.GitlabSelectionComponent)(keyOptions[variableKey] || [], variableSecretValue, VARIABLE_SECRET_INPUT_CLASS, 'ci_variable_value_field', (value) => {
                console.log('value', value);
            });
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
    const reloadForm = (allowShowDropdown) => {
        var _a, _b;
        for (const row of _rows) {
            if (allowShowDropdown) {
                if (row.clone) {
                    if (row.original.valueInput.is(':visible')) {
                        // alow empty value
                        const currentValue = row.original.valueInput.val();
                        if (((_a = keyOptions[row.key]) === null || _a === void 0 ? void 0 : _a.indexOf(currentValue)) === -1) {
                            (_b = keyOptions[row.key]) === null || _b === void 0 ? void 0 : _b.push(currentValue);
                        }
                        row.clone.valueInput = (0, components_1.GitlabSelectionComponent)(keyOptions[row.key] || [], currentValue, 'pipeline-form-ci-variable-value', 'ci_variable_value_field', (value) => {
                            console.log('value', value);
                        });
                        row.clone.valueInput.val(currentValue);
                        row.clone.valueInput.replaceAll(row.original.valueInput);
                    }
                }
            }
            else {
                if (row.clone) {
                    if (row.clone.valueInput.is(':visible')) {
                        const currentValue = row.clone.valueInput.val();
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
        if (e.target.nodeName !== 'INPUT')
            return;
        else {
            const isChecked = (0, shared_1.$)('#show_dropdown_checkbox').is(':checked');
            reloadForm(isChecked);
            editPipelineScheduleBtn.show();
            newEditPipelineScheduleBtn.hide();
            (0, shared_1.$)('.origin-remove-variable-btn').show();
            (0, shared_1.$)('.custom-remove-variable-btn').hide();
        }
    });
    //#region Reveal button click event
    revealValuesBtn.on('click', () => {
        var _a, _b;
        const _isShowDropdown = (0, shared_1.$)('#show_dropdown_checkbox').is(':checked');
        const isHidden = revealValuesBtn.text().includes('Reveal value');
        if (isHidden) {
            if (_isShowDropdown) {
                for (const row of _rows) {
                    (_a = row.clone) === null || _a === void 0 ? void 0 : _a.valueInput.show();
                }
            }
            else {
                // do nothing
            }
        }
        else {
            if (_isShowDropdown) {
                for (const row of _rows) {
                    (_b = row.clone) === null || _b === void 0 ? void 0 : _b.valueInput.hide();
                }
            }
            else {
                // do nothing
            }
        }
    });
    //#endregion
    newEditPipelineScheduleBtn.on('click', () => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const updatedVariables = [];
        const crtPersistedVariables = getPersistedVariables();
        for (const persistedVariable of crtPersistedVariables) {
            const persistedVariableRow = (0, shared_1.$)(persistedVariable);
            const variableKeyInput = persistedVariableRow.find(VARIABLE_KEY_INPUT);
            const variableKey = variableKeyInput.val();
            if (variableKey === undefined)
                continue;
            const variableSecretValueInput = persistedVariableRow.find(VARIABLE_SECRET_INPUT);
            const variableSecretValue = variableSecretValueInput.val();
            if (variableSecretValue === undefined)
                continue;
            updatedVariables.push({
                key: variableKey,
                value: variableSecretValue,
            });
        }
        // get last div
        const scheduleVueElement = (_d = (0, shared_1.$)('#content-body > div.col-lg-8.gl-pl-0')) === null || _d === void 0 ? void 0 : _d.get()[0];
        const scheduleVueInstanceData = scheduleVueElement.__vue__.$data;
        const updatedPipelineSchedule = {
            description: scheduleVueInstanceData.description,
            cron: scheduleVueInstanceData.cron,
            cronTimezone: scheduleVueInstanceData.cronTimezone,
            ref: scheduleVueInstanceData.scheduleRef,
            activate: scheduleVueInstanceData.activated,
            variables: updatedVariables,
        };
        yield glGraphqlClient.updatePipelineSchedule((0, shared_1.getScheduleIdFromUrl)(window.location.pathname), fullPath, updatedPipelineSchedule);
        // navigate to pipeline schedules page
        window.location.href = `${window.location.origin}/${fullPath}/-/pipeline_schedules`;
    }));
    //#endregion
});
exports.editPipelineSchedulePage = editPipelineSchedulePage;
