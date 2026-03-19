"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarDescriptionComponent = void 0;
function VarDescriptionComponent(text) {
    const varDescriptionHtml = `
	<div class="gl-text-gray-500 pb-4 pt-0 mt-0">
      ${text}
  </div>`;
    return $(varDescriptionHtml);
}
exports.VarDescriptionComponent = VarDescriptionComponent;
