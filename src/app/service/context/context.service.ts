import { Injectable } from '@angular/core';
import { Person } from '../../_models/person';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public static JWT_HEADER_NAME = 'Authentication';
  public JWT_TOKEN = 'auth_token';
  public CURRENT_USER = 'auth_user';
  public USER_IS_LOGGED_IN = 'auth_user_is_logged_in';
  public APP_SETTINGS_KEY = 'application_settings';

  public authenticate(person: Person): void {
    this.setUserIsLoggedIn(true);
    window.sessionStorage.setItem(this.CURRENT_USER, JSON.stringify(person));
  }

  public setAccessToken(person: Person, accessToken: string): void {
    window.sessionStorage.setItem(this.JWT_TOKEN, accessToken);
  }

  public getAccessToken(): string {
    return window.sessionStorage.getItem(this.JWT_TOKEN);
  }

  public getAuthenticationHeader(): string {
    const key = window.sessionStorage.getItem(this.APP_SETTINGS_KEY);
    const applicationSettings = JSON.parse(key);

    return applicationSettings['authenticationType'] === 'jwt' ? 'Authentication' : 'Authorization';
  }

  public getAuthenticationHeaderPrefixValue(): string {
    const applicationSettings = JSON.parse(window.sessionStorage.getItem(this.APP_SETTINGS_KEY));

    return applicationSettings['authenticationType'] === 'jwt' ? 'Bearer' : 'Basic';
  }

  public setApplicationSettings(applicationSettings: object): void  {
    window.sessionStorage.setItem(this.APP_SETTINGS_KEY, JSON.stringify(applicationSettings));
  }

  public getCurrentLoggedInUser(): Person {
    const currentUser = window.sessionStorage.getItem(this.CURRENT_USER);

    return JSON.parse(currentUser);
  }

  public userIsLoggedIn(): boolean {
    const userIsLoggedIn = window.sessionStorage.getItem(this.USER_IS_LOGGED_IN);

    return JSON.parse(userIsLoggedIn);
  }

  public setUserIsLoggedIn(value: boolean): void {
    window.sessionStorage.setItem(this.USER_IS_LOGGED_IN, JSON.stringify(value));
  }

  public setUsedLang(lang: string): void {
    if (lang !== undefined) {
      window.sessionStorage.setItem('lang', lang);
    }
  }

  public getLang(): string {
    return window.sessionStorage.getItem('lang');
  }

  public logout(): void {
    this.setUserIsLoggedIn(false);
    window.sessionStorage.removeItem(this.CURRENT_USER);
    window.sessionStorage.removeItem(this.JWT_TOKEN);
    window.sessionStorage.removeItem(this.APP_SETTINGS_KEY);
  }

}
