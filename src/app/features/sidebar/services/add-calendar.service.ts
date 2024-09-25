import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { BranchesDataModel } from 'src/app/models/BranchesModel';
import { ApiService } from 'src/app/shared/Services/api.service';
import { OrderService } from 'src/app/shared/Services/order.service';
import { UserService } from 'src/app/shared/Services/user.service';
import { messages } from 'src/assets/data/constants';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class AddCalendarService {

  constructor(private apiService: ApiService, 
    private userService: UserService, 
    private orderService: OrderService,
    private toastService: ToastrService,
    private filterService: FilterService) { }

  data: BranchesDataModel[] = [];


  getBranches() {
    return this.apiService.getData('branches').pipe(
      map((res) => {
        this.data = res["data"];
        return this.getRegions()
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }

  private filteredArea = new BehaviorSubject<BranchesDataModel[]>([]);
  private filteredBranches = new BehaviorSubject<BranchesDataModel[]>([]);

  getRegions() {
    return Array.from(new Set(this.data.map(item => item.regionName)));
  }

  filterArea(region: string[]) {
    const filtered = this.data.filter(item => region.includes(item.regionName));
    this.filteredArea.next(filtered);
  }

  getFilteredAreas() {
    return this.filteredArea.asObservable();
  }

  async filterBranches(areas: string[]) {
    this.userService.setLoader(true);
    const filtered = this.data.filter(item => areas.includes(item.area));
    this.filteredBranches.next(filtered);
    this.userService.setLoader(false);
  }

  getFilteredBranches() {
    return this.filteredBranches.asObservable();
  }

  createCalendar(calendar) {
    this.apiService.postData('calendar-view/create-calendar-view', calendar).subscribe({
      next: res => {
        if (res['statusCode'] === 1000) {
          this.orderService.getDefaultCalendar();
          this.toastService.success(res['message']);

        } else {
          this.toastService.error(res['message']);
        }
      },
      error: err => {
        this.toastService.error(messages.calendarFailed);

      }
    })

  }


 
  

 
}

