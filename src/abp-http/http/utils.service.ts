import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() {
  }

  getCookieValue(key: string): string {
    const equalities = document.cookie.split('; ');
    for (let i = 0; i < equalities.length; i++) {
      if (!equalities[i]) {
        continue;
      }

      const splitted = equalities[i].split('=');
      if (splitted.length != 2) {
        continue;
      }

      if (decodeURIComponent(splitted[0]) === key) {
        return decodeURIComponent(splitted[1] || '');
      }
    }

    return null;
  }

  setCookieValue(key: string, value: string, expireDate?: Date, path?: string): void {
    let cookieValue = encodeURIComponent(key) + '=';

    if (value) {
      cookieValue = cookieValue + encodeURIComponent(value);
    }

    if (expireDate) {
      cookieValue = cookieValue + "; expires=" + expireDate.toUTCString();
    }

    if (path) {
      cookieValue = cookieValue + "; path=" + path;
    }

    document.cookie = cookieValue;
  }

  deleteCookie(key: string, path?: string): void {
    let cookieValue = encodeURIComponent(key) + '=';

    cookieValue = cookieValue + "; expires=" + (new Date(new Date().getTime() - 86400000)).toUTCString();

    if (path) {
      cookieValue = cookieValue + "; path=" + path;
    }

    document.cookie = cookieValue;
  }

}
