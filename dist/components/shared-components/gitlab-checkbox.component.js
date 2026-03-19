"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabCheckboxComponent = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
function GitlabCheckboxComponent(label, controlLabel, className, checked = true, checkboxId) {
    const _checkboxId = checkboxId !== null && checkboxId !== void 0 ? checkboxId : label.replaceAll(' ', '') + '_checkbox';
    const checkboxComponentHtml = `
	<div class="${className !== null && className !== void 0 ? className : 'col-md-2'}">
		<label class="label-bold" for="${_checkboxId}">${label}</label>
		<div>
			<div class="gl-form-checkbox custom-control custom-checkbox">
				<input class="custom-control-input" type="checkbox" id="${_checkboxId}" ${checked ? 'checked' : ''}>
				<label class="custom-control-label" for="${_checkboxId}"><span>${controlLabel}</span></label>
			</div>
		</div>
	</div>
	`;
    return (0, jquery_slim_1.default)(checkboxComponentHtml);
}
exports.GitlabCheckboxComponent = GitlabCheckboxComponent;
