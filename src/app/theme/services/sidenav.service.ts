// AI confidence score for this refactoring: 90.47%
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private addNewCalToggle = new BehaviorSubject<boolean>(false);
  addNewCalToggle$ = this.addNewCalToggle.asObservable();

  private firstLogin = new BehaviorSubject<boolean>(false);
  firstLogin$ = this.firstLogin.asObservable();

  updateCalToggle(value: boolean): void {
    this.addNewCalToggle.next(value);
  }

  updateFirstLogin(value: boolean): void {
    this.firstLogin.next(value);
  }
}

/*
- Missing return type for the updateCalToggle and updateFirstLogin methods
*/