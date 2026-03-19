"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabSelectionComponent = void 0;
const config_1 = require("@/config");
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
function GitlabSelectionComponent(options, selectedValue, data_testId, data_qaSelector, action) {
    const gitlabSelectionHtml = `
  <div class="select-wrapper gl-relative gl-w-full">
    <select class="js-ci-variable-input-variable-type form-control select-control"
            data-testid="${data_testId}"
            data-qa-selector="${data_qaSelector}">
      ${options.map((option) => {
        return `<option ${option === selectedValue ? 'selected="selected"' : ''} value="${option}">${option}</option>`;
    })}
    </select>
    <svg data-testid="chevron-down-icon"
         role="img"
         aria-hidden="true"
         class="gl-absolute gl-right-3 gl-top-3 gl-text-gray-500 gl-icon s16 gl-fill-current"
         data-hidden="true">
      <use href="${config_1.gitlabSvgIconUrl}#chevron-down"></use>
    </svg>
  </div>
`;
    const gitlabSelectionJObject = (0, jquery_slim_1.default)(gitlabSelectionHtml);
    gitlabSelectionJObject.change(function () {
        action((0, jquery_slim_1.default)(this).val());
    });
    return gitlabSelectionJObject;
}
exports.GitlabSelectionComponent = GitlabSelectionComponent;
