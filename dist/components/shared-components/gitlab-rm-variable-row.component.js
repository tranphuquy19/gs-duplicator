"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabRemoveVariableRowComponent = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
const config_1 = require("@/config");
function GitlabRemoveVariableRowComponent() {
    const removeBtnHtml = `
	<button data-testid="remove-ci-variable-row" aria-label="Remove variable" type="button" class="btn ml-2 gl-md-ml-3 gl-mb-3 custom-remove-variable-btn btn-danger btn-md gl-button btn-danger-secondary btn-icon">
		<svg data-testid="clear-icon" role="img" aria-hidden="true" class="gl-button-icon gl-icon s16">
			<use href="${config_1.gitlabSvgIconUrl}#clear">
			</use>
		</svg>
	</button>`;
    return (0, jquery_slim_1.default)(removeBtnHtml);
}
exports.GitlabRemoveVariableRowComponent = GitlabRemoveVariableRowComponent;
