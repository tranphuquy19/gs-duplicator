"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickNewScheduleBtnComponent = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
function QuickNewScheduleBtnComponent() {
    const quickNewScheduleBtnHtml = `
	<a class="btn gl-button btn-success mr-2">
		<span>Quick new schedule</span>
	</a>`;
    const quickNewScheduleBtnJObject = (0, jquery_slim_1.default)(quickNewScheduleBtnHtml);
    quickNewScheduleBtnJObject.on('click', function () {
        (0, jquery_slim_1.default)(`#gs-dropdown-choose-branch`).toggle();
    });
    return quickNewScheduleBtnJObject;
}
exports.QuickNewScheduleBtnComponent = QuickNewScheduleBtnComponent;
