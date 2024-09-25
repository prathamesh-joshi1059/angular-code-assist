import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Orders } from 'src/app/models/orders';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  constructor() { }
  private addNewCalToggle = new BehaviorSubject<boolean>(false);
  addNewCalToggle$ = this.addNewCalToggle.asObservable();

  private firstLogin = new BehaviorSubject<boolean>(false);
  firstLogin$ = this.firstLogin.asObservable();

  updateCalToggle(value) {
    this.addNewCalToggle.next(value);
  }
  updateFirstLogin(value) {
    this.firstLogin.next(value);
  }
}
