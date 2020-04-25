import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContextService } from '../context/context.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStateService {

  constructor(private context: ContextService) {}


  private authState = new BehaviorSubject<boolean>(this.context.userIsLoggedIn());

  public setState(state: boolean): void {
    this.authState.next(state);
  }

  public getStateChange(): Observable<boolean> {
    return this.authState.asObservable();
  }

  public getAuthenticationState(): boolean {
    return this.authState.getValue();
  }
}
