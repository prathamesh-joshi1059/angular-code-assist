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
  private ActiveBranches: string[];
  constructor(
    private toastService: ToastrService,
    private filterService: FilterService,
    private apiService: ApiService,
  ) { }

  /* Function to set active braches */
  setBranches(branches: string[]) {
    this.ActiveBranches = branches;
  }
  /* Get active branches */
  public getBranches() {
    return this.ActiveBranches;
  }
  /* Function to update calendar list */
  updateCalList(newCalList: CustomView[]): void {
    this.calListSubject.next(newCalList);
  }
  /* Function to update calendar api call */
  updateCalendar(calendar) {
    return new Observable(observer => {
      this.apiService.postData('calendar-view/update-calendar-details', calendar).subscribe({
        next: res => {
          if (res['statusCode'] === 1000) {
            let data = res['data'][0];
            this.updateCalList(data['calendarList']);
            this.toastService.success(res['message'], '', { timeOut: 500 });
            observer.next(data['calendarList']);
          } else {
            this.toastService.error(res['message'], '', { timeOut: 500 });
            observer.error(res['message']);
          }
        },
        error: err => {
          this.toastService.error(messages.calendarFailed, '', { timeOut: 500 });
          observer.error(messages.calendarFailed);
        }
      });
    });
  }
  /* Function to get view orders api call as per selected calendar */
  getView(branches, date) {
    if (branches) {
      this.filterService.setRawData([]);
      let yearMonth = new Date(date).toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
      });

      let view = {
        branches: branches,
        yearMonth: yearMonth,
      };
      this.getViewOrders(view);
    }
  }
  /* Function to get the orders of the selected view (api call ) */
  getViewOrders(view) {
    this.apiService.postData('orders/month-view', view).subscribe({
      next: res => {
        if (res['statusCode'] === 1000) {
          this.filterService.setRawData(res['data']);
          if (res['data'].length == 0) {
            this.toastService.info(res['message']);
          }
        } else {
          this.toastService.error(res['message'], '', { timeOut: 500 })
        }
      },
      error: err => {
        this.toastService.error(messages.calendarFailed, '', { timeOut: 500 })
      }
    })

  }
}
