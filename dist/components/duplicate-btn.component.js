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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateBtnComponent = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
const config_1 = require("@/config");
const shared_1 = require("@/shared");
function DuplicateBtnComponent(scheduleId) {
    if (!scheduleId) {
        return;
    }
    const duplicateBtnHtml = `
		<a title="Duplicate" class="btn gl-button btn-default btn-icon" style="margin-right: 1em;">
			<svg class="s16" data-testid="duplicate-icon">
				<use href="${config_1.gitlabSvgIconUrl}#duplicate"></use>
			</svg>
		</a>`;
    const duplicateBtnJObject = (0, jquery_slim_1.default)(duplicateBtnHtml);
    // add click event to the duplicateBtn
    duplicateBtnJObject.on('click', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const glClient = shared_1.GitlabHttpClient.getInstance();
            const schedule = yield glClient.getPipeLineScheduleById(scheduleId);
            if (!schedule)
                return;
            const newSchedule = yield glClient.createPipelineSchedule({
                active: schedule.active,
                cron: schedule.cron,
                cron_timezone: schedule.cron_timezone,
                description: `${schedule.description}-copy`,
                ref: schedule.ref,
                variables: schedule.variables,
            });
            if (!!newSchedule && confirm(`Duplicated successfully! Go to the edit page?`)) {
                window.location.href = `${window.location.href}/${newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule.id}/edit`;
            }
            else {
                window.location.reload();
            }
        });
    });
    return duplicateBtnJObject;
}
exports.DuplicateBtnComponent = DuplicateBtnComponent;
