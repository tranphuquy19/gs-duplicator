import $ from 'jquery/dist/jquery.slim';

import { gitlabSvgIconUrl, saveGitlabToken, saveGitlabToolSettings } from '@/config';
import { GitlabToolSettingsModalComponent } from './gl-settings-modal.component';

let glToolsSettingsModalOpenedState = false;

export function GitlabToolSettingsBtnComponent() {
  const glToolSettingsBtnHtml = `
	<a class="btn gl-button btn-default">
		<svg class="s16" data-testid="settings-icon">
				<use href="${gitlabSvgIconUrl}#settings"></use>
		</svg>
		<span>Schedule Settings</span>
	</a>`;
  const glToolSettingsBtn = $(glToolSettingsBtnHtml);

  const addModal = () => {
    const modalJObject = GitlabToolSettingsModalComponent((eventType, payload) => {
      switch (eventType) {
        case 'close':
        case 'cancel':
          modalJObject.remove();
          break;
        case 'okay':
          const [gitlabToken, gitlabToolSettings] = payload;
          saveGitlabToken(gitlabToken);
          saveGitlabToolSettings(gitlabToolSettings);
          modalJObject.remove();
          // reload page
          window.location.reload();
          break;
        default:
          modalJObject.remove();
          break;
      }
    });

    $('body').append(modalJObject);
    $('body').addClass('modal-open');
  };

  const removeModal = () => {
    $('.modal').remove();

    $('body').removeClass('modal-open');
    glToolsSettingsModalOpenedState = false;
  };

  const toggleModal = () => {
    if (glToolsSettingsModalOpenedState) {
      removeModal();
    } else {
      addModal();
    }
  };

  glToolSettingsBtn.on('click', toggleModal);

  return glToolSettingsBtn;
}
