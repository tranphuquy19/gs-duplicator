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
const styles_1 = require("@/styles");
const pages_1 = require("@/pages");
const shared_1 = require("@/shared");
const RUN_SCRIPT_AFTER_MS = 0;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = window.location.href;
    GM_addStyle(styles_1.css);
    if ((0, shared_1.isPipelineScheduleUrl)(url)) {
        setTimeout(pages_1.pipelineSchedulesPage, RUN_SCRIPT_AFTER_MS);
    }
    else if ((0, shared_1.isEditPipelineScheduleUrl)(url)) {
        setTimeout(pages_1.editPipelineSchedulePage, RUN_SCRIPT_AFTER_MS);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        main();
    }
    catch (error) {
        console.error(error);
    }
}))();
