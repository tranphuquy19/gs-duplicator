"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitlabToken = exports.getTokenFromLocalStorage = void 0;
const config_1 = require("@/config");
function getTokenFromLocalStorage() {
    const _lsToken = window.atob(localStorage.getItem(config_1.gitlabTokenLocalStorageKey) || '');
    if (_lsToken && _lsToken.length > 0) {
        return _lsToken;
    }
    else {
        return '';
    }
}
exports.getTokenFromLocalStorage = getTokenFromLocalStorage;
function getGitlabToken() {
    const inputToken = prompt('Invalid Gitlab token. Please enter a valid token:');
    if (inputToken && inputToken.length > 0) {
        (0, config_1.saveGitlabToken)(inputToken);
        return inputToken;
    }
    else {
        throw new Error('token is required');
    }
}
exports.getGitlabToken = getGitlabToken;
