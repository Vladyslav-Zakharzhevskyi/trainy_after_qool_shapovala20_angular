import { Injectable } from '@angular/core';
import { ContextService } from '../service/context/context.service';
import { AuthenticationStateService } from '../service/subjects/authentication-state.service';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationListenerService {

  constructor(private context: ContextService,
              private authState: AuthenticationStateService,
              private api: ApiService,
              private router: Router) {

    this.authenticationStateListener();
  }

  private authenticationStateListener(): void {
    this.authState.getStateChange().subscribe(authState => {
      // Prevent executing logic if userIsLoggedIn currently
      if (this.context.userIsLoggedIn() && authState.userIsLoggedIn) { // -_-
        return;
      }

      // Login
      if (authState.userIsLoggedIn && authState.authPerson) {
        console.log('User has been Logged In!');
        this.context.setAccessToken(authState.authPerson, authState.accessToken);
        this.context.authenticate(authState.authPerson);
        this.router.navigate(['/applications']);
      } else {
        // Logout
        console.log('User has been Logged out!');
        this.context.logout();
        this.router.navigate(['/login']);
      }
    });
  }

}
