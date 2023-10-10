export function waitForElement(selector: string): Promise<Element | null> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
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
