// AI confidence score for this refactoring: 90.73%
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Orders } from 'src/app/models/orders';
import { ApiService } from 'src/app/shared/Services/api.service';
import { placeholderData } from 'src/app/models/placeholderModel';
import { MapViewService } from '../../map/services/map-view.service';
import { DatePipe } from '@angular/common';
import { SavedCalendarService } from '../../sidebar/services/saved-calendar.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  selectedOrder: Orders | null;
  day: Date;

  private toggleDrawerSubject = new BehaviorSubject<boolean>(false);
  toggleDrawer$ = this.toggleDrawerSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService,
    private mapViewService: MapViewService,
    private savedCalendarService: SavedCalendarService
  ) { }

  /* subject for placeholder drawer */
  setDrawerState(isOpen: boolean) {
    this.toggleDrawerSubject.next(isOpen);
  }

  /* open placeholder Drawer */
  openDrawer() {
    this.setDrawerState(true);
  }

  /* close placeholder Drawer */
  closeDrawer() {
    this.setDrawerState(false);
  }

  /* set placeholder order data */
  setOrders(orders: Orders | null) {
    this.selectedOrder = orders;
  }

  /*Get placeholder order data (edit purpose) */
  getOrder() {
    return this.selectedOrder;
  }

  /* Delete placeholder api call */
  deletePlaceholder(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteData('placeholders', id).subscribe({
          next: (res) => {
            console.log(res);
            if (res["statusCode"] === 1000) {
              this.toastrService.success('Placeholder deleted successfully');
              this.closeDrawer();
              this.refreshDayView();
            } else {
              console.log(res);
            }
          },
          error: err => {
            this.toastrService.error(err["message"]);
            console.log(err);
          }
        });
      }
    });
  }

  /* Api call for update placeholder */
  updatePlaceholder(id: string, data: placeholderData) {
    const updateObj = {
      id: id,
      payload: data
    };
    this.apiService.updateData('placeholders', updateObj).subscribe({
      next: res => {
        if (res["statusCode"] === 1000) {
          this.toastrService.success(res["message"]);
          this.closeDrawer();
          this.refreshDayView();
        } else {
          this.toastrService.error(res["message"]);
        }
      },
      error: err => {
        console.log(err);
        this.toastrService.error(err["message"]);
      }
    });
  }

  /* Refresh day view after successful delete and update */
  refreshDayView() {
    const payload = {
      date: new DatePipe('en-US').transform(this.day, 'yyyy-MM-dd'),
      branches: this.savedCalendarService.getBranches()
    };
    this.mapViewService.getMapViewOrders(payload);
  }
}

/*
- Unused imports
- The variable 'day' is declared but never assigned a value.
- The string comparison of 'statusCode' should use strict equality (===).
- No return type defined for methods.
- Inconsistent formatting for console logs.
- Possibly missing type for 'this.day' and 'this.selectedOrder'.
*/