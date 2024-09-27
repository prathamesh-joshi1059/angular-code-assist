// AI confidence score for this refactoring: 89.16%
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FilterService } from './filter.service';
import { ApiService } from 'src/app/shared/Services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomView } from 'src/app/models/custom-view';
import { messages } from 'src/assets/data/constants';

@Injectable({
  providedIn: 'root'
})
export class SavedCalendarService {
  /* subject to store calendar list */
  private calListSubject = new BehaviorSubject<CustomView[]>([]);
  calLists$ = this.calListSubject.asObservable();
  private activeBranches: string[];

  constructor(
    private toastService: ToastrService,
    private filterService: FilterService,
    private apiService: ApiService,
  ) {}

  /* Function to set active branches */
  setBranches(branches: string[]): void {
    this.activeBranches = branches;
  }

  /* Get active branches */
  public getBranches(): string[] {
    return this.activeBranches;
  }

  /* Function to update calendar list */
  updateCalList(newCalList: CustomView[]): void {
    this.calListSubject.next(newCalList);
  }

  /* Function to update calendar api call */
  updateCalendar(calendar: any): Observable<any> {
    return new Observable(observer => {
      this.apiService.postData('calendar-view/update-calendar-details', calendar).subscribe({
        next: res => {
          if (res['statusCode'] === 1000) {
            const data = res['data'][0];
            this.updateCalList(data['calendarList']);
            this.toastService.success(res['message'], '', { timeOut: 500 });
            observer.next(data['calendarList']);
          } else {
            this.toastService.error(res['message'], '', { timeOut: 500 });
            observer.error(res['message']);
          }
        },
        error: () => {
          this.toastService.error(messages.calendarFailed, '', { timeOut: 500 });
          observer.error(messages.calendarFailed);
        }
      });
    });
  }

  /* Function to get view orders api call as per selected calendar */
  getView(branches: string[], date: string): void {
    if (branches) {
      this.filterService.setRawData([]);
      const yearMonth = new Date(date).toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
      });

      const view = {
        branches: branches,
        yearMonth: yearMonth,
      };
      this.getViewOrders(view);
    }
  }

  /* Function to get the orders of the selected view (api call) */
  getViewOrders(view: any): void {
    this.apiService.postData('orders/month-view', view).subscribe({
      next: res => {
        if (res['statusCode'] === 1000) {
          this.filterService.setRawData(res['data']);
          if (res['data'].length === 0) {
            this.toastService.info(res['message']);
          }
        } else {
          this.toastService.error(res['message'], '', { timeOut: 500 });
        }
      },
      error: () => {
        this.toastService.error(messages.calendarFailed, '', { timeOut: 500 });
      }
    });
  }
}

/* Issues:
- Incorrect variable naming convention for 'ActiveBranches'; should start with a lowercase letter.
- Type for 'calendar' in 'updateCalendar' function is not defined.
- Lack of return type for methods where applicable (e.g., setBranches, getBranches, getView, getViewOrders).
- Use of 'let' instead of 'const' where variables are not reassigned (e.g., yearMonth, view).
- Use of non-strict comparison (==) in getViewOrders method. Replace with (===) for consistency.
*/