import $ from "jquery/dist/jquery.slim";

import { gitlabSvgIconUrl } from '@/config';
import { DropdownItem } from '@/types';

export function GitlabDropdownComponent(dropdownName: string, dropdownTitle: string, dropdownItems: DropdownItem[] | Promise<DropdownItem[]>) {
	// Dropdown
	const glDropdownHtml = `
	<div class="dropdown b-dropdown gl-dropdown undefined btn-group" id="gs-dropdown-${dropdownName}">
	</div>`;
	const glDropdownJObject = $(glDropdownHtml);
	glDropdownJObject.hide();

	// Dropdown toggle button
	const glDropdownToggleBtnHtml = `
	<button aria-haspopup="true" aria-expanded="false" type="button" class="btn dropdown-toggle btn-default btn-md gl-button gl-dropdown-toggle">
		 <span class="gl-dropdown-button-text">${dropdownTitle}</span>
		 <svg data-testid="chevron-down-icon" role="img" aria-hidden="true" class="gl-button-icon dropdown-chevron gl-icon s16">
				<use href="${gitlabSvgIconUrl}#chevron-down"></use>
		 </svg>
	</button>`;
	const glDropdownToggleBtnJObject = $(glDropdownToggleBtnHtml);
	glDropdownJObject.click(() => {
		$(`#gs-dropdown-${dropdownName}`).toggleClass('show');
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
	const glDropdownMenuJObject = $(glDropdownMenuHtml);
	glDropdownJObject.append(glDropdownMenuJObject);

	// Dropdown menu items
	const addItemsToDropdown = (items: DropdownItem[]) => {
		for (let item of items) {
			const glDropdownMenuItemHtml = `
				<li role="presentation" class="gl-dropdown-item">
					<button role="menuitem" type="button" class="dropdown-item">
						<div class="gl-dropdown-item-text-wrapper">
							<p class="gl-dropdown-item-text-primary">${item.text}</p>
						</div>
					</button>
				</li>`;
			const glDropdownMenuItemJObject = $(glDropdownMenuItemHtml);
			glDropdownMenuItemJObject.click(item.fn);
			glDropdownMenuJObject.find(`#gs-dropdown-contents-${dropdownName}`).append(glDropdownMenuItemJObject);
		}
	};

	if (dropdownItems instanceof Promise) {
		dropdownItems.then((items) => {
			addItemsToDropdown(items);
			return items;
		});
	} else {
		addItemsToDropdown(dropdownItems);
	}

	// remove class 'show' when clicking outside of dropdown
	$(document).click((e) => {
		if (!$(e.target).closest(glDropdownJObject).length) {
			glDropdownJObject.removeClass('show');
		}
	});

	return glDropdownJObject;
}
