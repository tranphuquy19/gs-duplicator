export function VarDescriptionComponent(text: string) {
  const varDescriptionHtml = `
	<div class="gl-text-gray-500 pb-2">
      ${text}
  </div>`;
  return $(varDescriptionHtml);
}
