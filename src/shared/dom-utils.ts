/**
 * Wait for an element to appear in the DOM
 * @param selector CSS selector
 * @param timeout Timeout in milliseconds
 * @returns
 */
export function waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    let observer: MutationObserver | null = null;

    const timeoutId = setTimeout(() => {
      if (observer) {
        observer.disconnect();
      }
      reject(`Element with selector ${selector} not found within ${timeout}ms`);
    }, timeout);

    observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearTimeout(timeoutId);
        if (observer) {
          observer.disconnect();
        }
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// this method will replace all ${key} in html with the value of params[key]
export function htmlVarInjector(html: string, params: any) {
  return html.replace(/\${(.*?)}/g, (match, key) => {
    return params[key];
  });
}
