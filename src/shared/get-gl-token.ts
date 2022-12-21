import { gitlabTokenLocalStorageKey } from '@/config';

export function getTokenFromLocalStorage(): string {
  const _lsToken = window.atob(localStorage.getItem(gitlabTokenLocalStorageKey) || '');
  if (_lsToken && _lsToken.length > 0) {
    return _lsToken;
  } else {
    return '';
  }
}

export function getGitlabToken(): string {
  const inputToken = prompt('Invalid Gitlab token. Please enter a valid token:');
  if (inputToken && inputToken.length > 0) {
    localStorage.setItem(gitlabTokenLocalStorageKey, window.btoa(inputToken));
    return inputToken;
  } else {
    throw new Error('token is required');
  }
}
