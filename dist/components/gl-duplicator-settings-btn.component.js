"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabToolSettingsBtnComponent = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
const config_1 = require("@/config");
const gl_settings_modal_component_1 = require("./gl-settings-modal.component");
let glToolsSettingsModalOpenedState = false;
function GitlabToolSettingsBtnComponent() {
    const glToolSettingsBtnHtml = `
	<a class="btn gl-button btn-default ml-2">
		<svg class="s16" data-testid="settings-icon">
				<use href="${config_1.gitlabSvgIconUrl}#settings"></use>
		</svg>
		<span>Schedule Settings</span>
	</a>`;
    const glToolSettingsBtn = (0, jquery_slim_1.default)(glToolSettingsBtnHtml);
    const addModal = () => {
        const modalJObject = (0, gl_settings_modal_component_1.GitlabToolSettingsModalComponent)((eventType, payload) => {
            switch (eventType) {
                case 'close':
                case 'cancel':
                    modalJObject.remove();
                    break;
                case 'okay':
                    const [gitlabToken, gitlabToolSettings] = payload;
                    (0, config_1.saveGitlabToken)(gitlabToken);
                    (0, config_1.saveGitlabToolSettings)(gitlabToolSettings);
                    modalJObject.remove();
                    // reload page
                    window.location.reload();
                    break;
                default:
                    modalJObject.remove();
                    break;
            }
        });
        (0, jquery_slim_1.default)('body').append(modalJObject);
        (0, jquery_slim_1.default)('body').addClass('modal-open');
    };
    const removeModal = () => {
        (0, jquery_slim_1.default)('.modal').remove();
        (0, jquery_slim_1.default)('body').removeClass('modal-open');
        glToolsSettingsModalOpenedState = false;
    };
    const toggleModal = () => {
        if (glToolsSettingsModalOpenedState) {
            removeModal();
        }
        else {
            addModal();
        }
    };
    glToolSettingsBtn.on('click', toggleModal);
    return glToolSettingsBtn;
}
exports.GitlabToolSettingsBtnComponent = GitlabToolSettingsBtnComponent;
