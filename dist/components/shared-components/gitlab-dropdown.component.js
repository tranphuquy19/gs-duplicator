"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabDropdownComponent = void 0;
const jquery_slim_1 = __importDefault(require("jquery/dist/jquery.slim"));
const config_1 = require("@/config");
function GitlabDropdownComponent(dropdownName, dropdownTitle, dropdownItems) {
    // Dropdown
    const glDropdownHtml = `
	<div class="dropdown b-dropdown gl-dropdown undefined btn-group" id="gs-dropdown-${dropdownName}">
	</div>`;
    const glDropdownJObject = (0, jquery_slim_1.default)(glDropdownHtml);
    glDropdownJObject.hide();
    // Dropdown toggle button
    const glDropdownToggleBtnHtml = `
	<button aria-haspopup="true" aria-expanded="false" type="button" class="btn dropdown-toggle btn-default btn-md gl-button gl-dropdown-toggle">
		 <span class="gl-dropdown-button-text">${dropdownTitle}</span>
		 <svg data-testid="chevron-down-icon" role="img" aria-hidden="true" class="gl-button-icon dropdown-chevron gl-icon s16">
				<use href="${config_1.gitlabSvgIconUrl}#chevron-down"></use>
		 </svg>
	</button>`;
    const glDropdownToggleBtnJObject = (0, jquery_slim_1.default)(glDropdownToggleBtnHtml);
    glDropdownJObject.on('click', () => {
        (0, jquery_slim_1.default)(`#gs-dropdown-${dropdownName}`).toggleClass('show');
    });
    glDropdownJObject.append(glDropdownToggleBtnJObject);
    // Dropdown menu
    const glDropdownMenuHtml = `
	<ul role="menu" tabindex="-1" class="dropdown-menu" aria-labelledby="" style="">
		<div class="gl-dropdown-inner">
			<div class="gl-dropdown-contents" id="gs-dropdown-contents-${dropdownName}">
			</div>
		</div>
	</ul>`;
    const glDropdownMenuJObject = (0, jquery_slim_1.default)(glDropdownMenuHtml);
    glDropdownJObject.append(glDropdownMenuJObject);
    // Dropdown menu items
    const addItemsToDropdown = (items) => {
        for (const item of items) {
            const glDropdownMenuItemHtml = `
				<li role="presentation" class="gl-dropdown-item">
					<button role="menuitem" type="button" class="dropdown-item">
						<div class="gl-dropdown-item-text-wrapper">
							<p class="gl-dropdown-item-text-primary">${item.text}</p>
						</div>
					</button>
				</li>`;
            const glDropdownMenuItemJObject = (0, jquery_slim_1.default)(glDropdownMenuItemHtml);
            glDropdownMenuItemJObject.on('click', item.fn);
            glDropdownMenuJObject
                .find(`#gs-dropdown-contents-${dropdownName}`)
                .append(glDropdownMenuItemJObject);
        }
    };
    if (dropdownItems instanceof Promise) {
        dropdownItems.then((items) => {
            addItemsToDropdown(items);
            return items;
        });
    }
    else {
        addItemsToDropdown(dropdownItems);
    }
    // remove class 'show' when clicking outside of dropdown
    (0, jquery_slim_1.default)(document).on('click', (e) => {
        if (!(0, jquery_slim_1.default)(e.target).closest(glDropdownJObject).length) {
            glDropdownJObject.removeClass('show');
        }
    });
    return glDropdownJObject;
}
exports.GitlabDropdownComponent = GitlabDropdownComponent;
