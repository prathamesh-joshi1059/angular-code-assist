import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Orders } from 'src/app/models/orders';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { SidenavService } from 'src/app/theme/services/sidenav.service';
import { CustomView } from 'src/app/models/custom-view';
import { FilterService } from 'src/app/features/sidebar/services/filter.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private sidenavService: SidenavService,
    private filterService: FilterService
  ) {}
  private ordersData = new BehaviorSubject<Orders[]>([]);
  ordersData$ = this.ordersData.asObservable();

  updateOrdersData(data: Orders[]) {
    this.ordersData.next(data);
  }

  private calList = new BehaviorSubject<CustomView[]>([]);
  calList$ = this.calList.asObservable();

  getCalendarList(calList) {
    this.calList.next(calList);
  }

  // getDefaultCalendar() {
  //   console.warn(this.userService.loggedUser.userEmail);
  //   let user = {
  //     userId: this.userService.loggedUser.userEmail,
  //     userName: this.userService.loggedUser.name,
  //   };
  //   this.apiService.postData('calendar-view/default', user).subscribe({
  //     next: (res: any) => {
  //       let jsonString = res.replace(/^[^{]*([\s\S]*?)[^}]*$/, '$1');
  //       console.log(jsonString);
  //       try {
  //         let parsedData = JSON.parse(jsonString);
  //         console.log('Parsed data:', parsedData);
  //         // Process the parsed data...
  //       } catch (error) {
  //         console.error('Error parsing JSON:', error);
  //       }
  //     },
  //   });
  // }
  getDefaultCalendar() {
    let allOrders = [];
    let user = {
      userId: this.userService.loggedUser.userEmail,
      userName: this.userService.loggedUser.name,
    };

    this.apiService.getCalendarView(user).subscribe({
      next: (data: any) => {
        if (data && data.defaultCalendarView != null) {
          this.sidenavService.updateCalToggle(false);
          this.sidenavService.updateFirstLogin(false);
          this.getCalendarList(data['calendarList']);
        }
        if (data && Array.isArray(data)) {
          allOrders = [...allOrders, ...data] as unknown[] as any;
          this.filterService.setRawData(allOrders);
          // console.log(data);
        }
      },
      error: (err) => {
        console.warn(err);
      },
    });
  }
}
