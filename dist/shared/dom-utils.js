"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlVarInjector = exports.waitForElement = void 0;
/**
 * Wait for an element to appear in the DOM
 * @param selector CSS selector
 * @param timeout Timeout in milliseconds
 * @returns
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }
        let observer = null;
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
exports.waitForElement = waitForElement;
// this method will replace all ${key} in html with the value of params[key]
function htmlVarInjector(html, params) {
    return html.replace(/\${(.*?)}/g, (match, key) => {
        return params[key];
    });
}
exports.htmlVarInjector = htmlVarInjector;
