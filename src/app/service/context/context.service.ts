import {Injectable} from '@angular/core';
import {Person} from '../../_models/person';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public JWT_TOKEN = 'auth_token';
  public JWT_HEADER_NAME = 'Authentication';
  public CURRENT_USER = 'auth_user';
  public USER_IS_LOGGED_IN = 'auth_user_is_logged_in';
  public APP_SETTINGS_KEY = 'application_settings';

  constructor() {}

  public authenticate(person: Person) {
    window.sessionStorage.removeItem(this.CURRENT_USER);
    window.sessionStorage.setItem(this.CURRENT_USER, JSON.stringify(person));
    this.setUserIsLoggedIn(true);
  }

  public setAccessToken(person: Person, resp: HttpResponse<Person>) {
    window.sessionStorage.removeItem(this.JWT_TOKEN);

    const app_set = JSON.parse(window.sessionStorage.getItem(this.APP_SETTINGS_KEY));
    if (app_set.authenticationType == 'jwt') {
      const accessToken = resp.headers.get(this.JWT_HEADER_NAME);
      window.sessionStorage.setItem(this.JWT_TOKEN, accessToken);
    } else if (app_set.authenticationType == 'basic') {
      const accessToken = window.btoa(person.username + ':' + person.password);
      window.sessionStorage.setItem(this.JWT_TOKEN, accessToken);
    }
  }

  public getAccessToken(): string {
    const item = window.sessionStorage.getItem(this.JWT_TOKEN);
    if (item) {
      return this.getAuthenticationHeaderPrefixValue() + item;
    }
    return null;
  }

  public getAuthenticationHeader(): string {
    const key = window.sessionStorage.getItem(this.APP_SETTINGS_KEY);
    const applicationSettings = JSON.parse(key);
    return applicationSettings['authenticationType'] === 'jwt' ? 'Authentication' : 'Authorization';
  }

  public getAuthenticationHeaderPrefixValue(): string {
    const key = window.sessionStorage.getItem(this.APP_SETTINGS_KEY);
    const applicationSettings = JSON.parse(key);
    return applicationSettings['authenticationType'] === 'jwt' ? 'Bearer ' : 'Basic ';
  }

  public setApplicationSettings(applicationSettings: object)  {
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

  public setUserIsLoggedIn(value: boolean) {
    window.sessionStorage.setItem(this.USER_IS_LOGGED_IN, JSON.stringify(value));
  }

  public setUsedLang(lang: string): void {
    if (lang != null) {
      window.sessionStorage.setItem('lang', lang);
    }
  }

  public getLang(): string {
    return window.sessionStorage.getItem('lang');
  }

  public logout(): void {
    window.sessionStorage.removeItem(this.CURRENT_USER);
    window.sessionStorage.removeItem(this.JWT_TOKEN);
    window.sessionStorage.removeItem(this.USER_IS_LOGGED_IN);
  }

}
