import $$ from 'jquery/dist/jquery.slim';

export function $(selector: any): JQuery<HTMLElement> {
  const htmlElements = $$(selector);
  if (htmlElements.length === 0) {
    console.error(`No element found for selector ${selector}`);
  }
  return htmlElements;
}
