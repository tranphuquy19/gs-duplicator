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
exports.DownloadEnvBtnComponent = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
const config_1 = require("@/config");
const shared_1 = require("@/shared");
function DownloadEnvBtnComponent(scheduleId) {
    if (!scheduleId) {
        return;
    }
    const downloadEnvBtnHtml = `<a title="Download Env File" class="btn gl-button btn-default btn-icon">
			<svg class="s16" data-testid="download-icon">
				<use href="${config_1.gitlabSvgIconUrl}#download"></use>
			</svg>
		</a>`;
    const downloadEnvBtnJObject = (0, jquery_slim_1.default)(downloadEnvBtnHtml);
    // add click event to the downloadEnvBtn
    downloadEnvBtnJObject.on('click', () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const glClient = shared_1.GitlabHttpClient.getInstance();
        const glGraphqlClient = shared_1.GitlabGraphqlClient.getInstance();
        const variables = [];
        const schedule = yield glClient.getPipeLineScheduleById(scheduleId);
        if (!schedule)
            return;
        if (config_1.includeAllVariables) {
            const fullPath = (0, shared_1.getProjectFullPath)(window.location.pathname);
            const ciVariables = (yield glGraphqlClient.getCiConfigVariables(fullPath, (schedule === null || schedule === void 0 ? void 0 : schedule.ref) || config_1.gitlabDefaultPipelineSchedule.ref)) || [];
            // left join ciVariables and schedule.variables
            const joined = (0, shared_1.leftJoin)(ciVariables, (_a = schedule === null || schedule === void 0 ? void 0 : schedule.variables) !== null && _a !== void 0 ? _a : [], 'key', (left, right) => (Object.assign(Object.assign({}, left), right)));
            variables.push(...joined);
        }
        else {
            variables.push(...((_b = schedule === null || schedule === void 0 ? void 0 : schedule.variables) !== null && _b !== void 0 ? _b : []));
        }
        (0, shared_1.downloadEnvFile)(variables, schedule.description);
    }));
    return downloadEnvBtnJObject;
}
exports.DownloadEnvBtnComponent = DownloadEnvBtnComponent;
