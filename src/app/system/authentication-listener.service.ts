import { Injectable } from '@angular/core';
import {ContextService} from "../service/context/context.service";
import {AuthenticationStateService} from "../service/subjects/authentication-state.service";
import {ApiService} from "../api/api.service";
import {Router} from "@angular/router";
import {SnackBarService} from "../service/custom/snack-bar.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationListenerService {

  public userIsLoggedIn: boolean = false;
  public currentLoggedInUserName: string = "";

  constructor(private context: ContextService,
              private authState: AuthenticationStateService,
              private api: ApiService,
              private router: Router,
              private snackBarService: SnackBarService) {

    this.userIsLoggedIn = this.context.userIsLoggedIn();
    this.initLoginLogout();
  }

  private initLoginLogout(): void {
    this.authState.getStateChange().subscribe(isUserAuthenticated => {
      this.userIsLoggedIn = isUserAuthenticated;

      if (isUserAuthenticated) {
        this.initLogin();
      } else if (!isUserAuthenticated) {
        this.initLogout();
      }
    });
  }

  private initLogin() {
    let loggedInUser = this.context.getCurrentLoggedInUser();
    this.currentLoggedInUserName = loggedInUser.firstName;
  }

  private initLogout() {
    this.context.logout();
    this.api.logout().subscribe();
    this.router.navigate(['/login']);
  }

  public logout(): void {
    this.authState.setState(false);
    this.snackBarService.showSnackBar("Logon has been successful!", "error", 4000);
  }

}
