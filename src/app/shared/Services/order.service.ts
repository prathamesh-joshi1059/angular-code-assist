// AI confidence score for this refactoring: 80.10%
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
  private ordersData = new BehaviorSubject<Orders[]>([]);
  ordersData$ = this.ordersData.asObservable();

  private calList = new BehaviorSubject<CustomView[]>([]);
  calList$ = this.calList.asObservable();

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private sidenavService: SidenavService,
    private filterService: FilterService
  ) {}

  updateOrdersData(data: Orders[]): void {
    this.ordersData.next(data);
  }

  getCalendarList(calList: CustomView[]): void {
    this.calList.next(calList);
  }

  getDefaultCalendar(): void {
    let allOrders: Orders[] = [];
    const user = {
      userId: this.userService.loggedUser.userEmail,
      userName: this.userService.loggedUser.name,
    };

    this.apiService.getCalendarView(user).subscribe({
      next: (data: any) => {
        if (data?.defaultCalendarView !== null) {
          this.sidenavService.updateCalToggle(false);
          this.sidenavService.updateFirstLogin(false);
          this.getCalendarList(data.calendarList);
        }
        if (data && Array.isArray(data)) {
          allOrders = [...allOrders, ...data];
          this.filterService.setRawData(allOrders);
        }
      },
      error: (err) => {
        console.warn(err);
      },
    });
  }
}

// Issues: 
// 1. No type specified for 'calList' parameter in getCalendarList method.
// 2. 'allOrders' should have a type specified. 
// 3. use of 'any' for 'data' when subscribing to observable.
// 4. using 'as unknown[] as any', multiple assertions make the code less readable.
// 5. Use of 'let' instead of 'const' for 'user', as its value doesn't change.
// 6. Unused commented code should be removed.
// 7. Unused parameter 'calList' in 'getCalendarList' type should be explicit.