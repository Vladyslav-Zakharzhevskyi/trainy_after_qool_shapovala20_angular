import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContextService } from '../service/context/context.service';
import { Person } from '../_models/person';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStateService {

  constructor(private context: ContextService) {}


  private authState = new BehaviorSubject<AuthenticationState>(this.uploadFromSessionStorage());

  public uploadFromSessionStorage(): AuthenticationState {
    return new AuthenticationState(
      this.context.userIsLoggedIn(), this.context.getCurrentLoggedInUser(), this.context.getAccessToken(), {preventLogout: true});
  }

  public setState(state: AuthenticationState): void {
    this.authState.next(state);
  }

  public getStateChange(): Observable<AuthenticationState> {
    return this.authState.asObservable();
  }

  public getAuthenticationState(): AuthenticationState {
    return this.authState.getValue();
  }
}

export class AuthenticationState {
  private readonly _userIsLoggedIn: boolean;
  private readonly _authPerson: Person;
  private readonly _accessToken: string;
  private readonly _opts: object;

  constructor(userIsLoggedIn: boolean, authPerson: Person | undefined, accessToken: string | undefined, opts?: object) {
    this._userIsLoggedIn = userIsLoggedIn;
    this._authPerson = authPerson;
    this._accessToken = accessToken;
    this._opts = opts;
  }

  get userIsLoggedIn(): boolean {
    return this._userIsLoggedIn;
  }

  get authPerson(): Person {
    return this._authPerson;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get opts(): object {
    return this._opts;
  }

  isPreventLogout(): boolean {
    if (this.opts && this.opts['preventLogout']) {
      return true;
    }

    return false;
  }
}
