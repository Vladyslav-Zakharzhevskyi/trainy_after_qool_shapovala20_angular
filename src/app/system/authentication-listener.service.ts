import { Injectable } from '@angular/core';
import { ContextService } from '../service/context/context.service';
import { AuthenticationStateService } from '../service/subjects/authentication-state.service';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationListenerService {

  public userIsLoggedIn = false;
  public currentLoggedInUserName = '';

  constructor(private context: ContextService,
              private authState: AuthenticationStateService,
              private api: ApiService,
              private router: Router) {

    this.userIsLoggedIn = this.context.userIsLoggedIn();
    this.initLoginLogout();
  }

  private initLoginLogout(): void {
    this.authState.getStateChange()
      .subscribe(isUserAuthenticated => {
        this.userIsLoggedIn = isUserAuthenticated;

        if (isUserAuthenticated) {
          this.initLogin();
        } else if (!isUserAuthenticated) {
          // this.initLogout();
        }
      });
  }

  private initLogin(): void {
    const loggedInUser = this.context.getCurrentLoggedInUser();
    this.currentLoggedInUserName = loggedInUser.firstName;
  }

  private initLogout(): void {
    this.context.logout();
    this.api.logout()
      .subscribe();
    this.router.navigate(['/login']);
  }

  public logout(): void {
    this.authState.setState(false);
  }

}
