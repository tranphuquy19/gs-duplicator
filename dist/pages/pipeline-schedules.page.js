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
exports.pipelineSchedulesPage = void 0;
const components_1 = require("@/components");
const shared_1 = require("@/shared");
const pipelineSchedulesPage = () => __awaiter(void 0, void 0, void 0, function* () {
    const glGraphqlClient = shared_1.GitlabGraphqlClient.getInstance();
    const fullPath = (0, shared_1.getProjectFullPath)(window.location.pathname);
    const [schedules, _] = yield Promise.all([
        glGraphqlClient.getPipelineSchedulesQuery(fullPath),
        (0, shared_1.waitForElement)('tr[data-testid="pipeline-schedule-table-row"]'), // wait for the pipeline schedule table to be rendered
    ]);
    // find the buttons with attribute title="Play" in the btnGroup
    // let playBtns = $('.tab-pane.active').find('.btn-group').find(`[title='Run pipeline schedule']`);
    // if (playBtns.length === 0) {
    //   playBtns = $('.btn-group').find(`[title='Play']`);
    // }
    // find the button with text "New schedule"
    const newScheduleBtns = $('.btn.btn-confirm:contains("New schedule")');
    const newScheduleBtn = $(newScheduleBtns.get());
    const quickNewScheduleBtn = (0, components_1.QuickNewScheduleBtnComponent)();
    const settingsBtn = (0, components_1.GitlabToolSettingsBtnComponent)();
    // create a new div btnGroup with class ml-auto, move the newScheduleBtn to the enter of the new btnGroup
    const newBtnGroup = $('<div class="gl-ml-auto"></div>');
    newBtnGroup.insertBefore(newScheduleBtn);
    newScheduleBtn.appendTo(newBtnGroup);
    if (quickNewScheduleBtn) {
        quickNewScheduleBtn.insertBefore(newScheduleBtn);
        settingsBtn.insertAfter(newScheduleBtn);
    }
    // find the buttons with attribute datat-testid="delete-pipeline-schedule-btn" in the btnGroup
    const deleteBtns = $('.tab-pane.active')
        .find('.btn-group')
        .find(`[data-testid='delete-pipeline-schedule-btn']`);
    for (const [_, btnItem] of Array.from(deleteBtns).entries()) {
        const delBtn = $(btnItem);
        const scheduleDesc = delBtn
            .closest('tr')
            .find('[data-testid="pipeline-schedule-description"]')
            .text()
            .trim();
        const rowSchedule = schedules.project.pipelineSchedules.nodes.find((sch) => {
            return sch.description === scheduleDesc;
        });
        const scheduleIndex = (0, shared_1.getScheduleIdFromGid)(rowSchedule.id);
        // const playBtnHref = editBtn.attr('href') as string;
        // const scheduleId = getGitlabScheduleIdFromUrl(playBtnHref);
        const duplicateBtn = (0, components_1.DuplicateBtnComponent)(scheduleIndex);
        if (duplicateBtn) {
            duplicateBtn.insertBefore(delBtn);
            const downloadEnvFileBtn = (0, components_1.DownloadEnvBtnComponent)(scheduleIndex);
            if (downloadEnvFileBtn) {
                downloadEnvFileBtn.insertBefore(duplicateBtn);
            }
        }
    }
    const glChooseBranchDropdown = yield (0, components_1.ChooseBranchDropdownComponent)();
    glChooseBranchDropdown.insertBefore(quickNewScheduleBtn);
});
exports.pipelineSchedulesPage = pipelineSchedulesPage;
