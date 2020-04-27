import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContextService } from '../context/context.service';
import { Person } from '../../_models/person';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStateService {

  constructor(private context: ContextService) {}


  private authState = new BehaviorSubject<AuthenticationState>(this.uploadFromSessionStorage());

  public uploadFromSessionStorage(): AuthenticationState {
    return new AuthenticationState(this.context.userIsLoggedIn(), this.context.getCurrentLoggedInUser(), this.context.getAccessToken());
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

  constructor(userIsLoggedIn: boolean, authPerson: Person | undefined, accessToken: string | undefined) {
    this._userIsLoggedIn = userIsLoggedIn;
    this._authPerson = authPerson;
    this._accessToken = accessToken;
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
}
