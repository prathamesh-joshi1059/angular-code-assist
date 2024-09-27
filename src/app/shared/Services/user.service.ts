// AI confidence score for this refactoring: 73.92%
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedUser: { name: string; userEmail: string } | null = null;
  public loader = new BehaviorSubject<boolean>(false);

  constructor(private authService: MsalService) { }

  get loggedUserInfo() {
    return this.loggedUser;
  }

  set loggedUserInfo(user: { name: string; username: string }) {
    this.loggedUser = {
      name: user?.name,
      userEmail: user?.username,
    };
  }

  setLoader(value: boolean): void {
    this.loader.next(value);
  }
}

// Issues: 
// 1. The loggeduser property should not be of type 'any'.
// 2. Setter and getter methods should have consistent naming.
// 3. Used public modifier unnecessarily for the loader BehaviorSubject.
// 4. Missing type annotations for the input parameter in the setter method.
// 5. Incorrect usage of a public member in the constructor.