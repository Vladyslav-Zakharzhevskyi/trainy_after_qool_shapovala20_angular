import { Injectable } from '@angular/core';
import { ContextService } from '../service/context/context.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityContext {

  constructor(private context: ContextService) { }

  hasEditRightsYouOwn(userId: string): boolean {
    if (userId) {
      const currentLoggedInUser = this.context.getCurrentLoggedInUser();
      return currentLoggedInUser && currentLoggedInUser.id === userId;
    }
    return false;
  }
}
