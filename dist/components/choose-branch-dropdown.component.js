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
exports.ChooseBranchDropdownComponent = void 0;
const config_1 = require("@/config");
const shared_1 = require("@/shared");
const shared_components_1 = require("./shared-components");
function ChooseBranchDropdownComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        const glClient = shared_1.GitlabHttpClient.getInstance();
        const glGraphqlClient = shared_1.GitlabGraphqlClient.getInstance();
        const branches = yield glClient.getProjectBranches();
        const dropdownItems = branches === null || branches === void 0 ? void 0 : branches.map((branchName) => ({
            text: branchName,
            fn: () => __awaiter(this, void 0, void 0, function* () {
                const fullPath = (0, shared_1.getProjectFullPath)(window.location.pathname);
                if (fullPath) {
                    const vars = yield glGraphqlClient.getCiConfigVariables(fullPath, `refs/heads/${branchName}`);
                    if (!vars)
                        return;
                    const newPipelineSchedule = yield glClient.createPipelineSchedule(Object.assign(Object.assign({}, config_1.gitlabDefaultPipelineSchedule), { ref: branchName }));
                    yield Promise.all(vars.map((_var) => glClient.createPipelineScheduleVariable(newPipelineSchedule === null || newPipelineSchedule === void 0 ? void 0 : newPipelineSchedule.id, _var)));
                    if (!!newPipelineSchedule && confirm(`Create schedule success! Go to the edit page?`)) {
                        window.location.href = `${window.location.href}/${newPipelineSchedule === null || newPipelineSchedule === void 0 ? void 0 : newPipelineSchedule.id}/edit`;
                    }
                    else {
                        window.location.reload();
                    }
                }
            }),
        }));
        return (0, shared_components_1.GitlabDropdownComponent)('choose-branch', 'Copy vars from branch', dropdownItems || [{ text: 'No branches found', fn: () => { } }]);
    });
}
exports.ChooseBranchDropdownComponent = ChooseBranchDropdownComponent;
