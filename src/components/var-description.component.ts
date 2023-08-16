export function VarDescriptionComponent(text: string) {
  const varDescriptionHtml = `
	<div class="gl-text-gray-500 pb-4 pt-0 mt-0">
      ${text}
  </div>`;
  return $(varDescriptionHtml);
}
