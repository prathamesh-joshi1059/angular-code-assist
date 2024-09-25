import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggeduser: any = null;
  constructor(public authService: MsalService) { }

  get loggedUser() {
    return this.loggeduser;
  }
  
  set setLoggedUser(user: any) {
    this.loggeduser = {
      name: user?.name,
      userEmail: user?.username,
    };

  }



  public loader = new BehaviorSubject(false);
  setLoader(value: boolean) {
    this.loader.next(value);
  }
}

