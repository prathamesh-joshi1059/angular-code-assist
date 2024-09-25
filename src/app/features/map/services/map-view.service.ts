import { Injectable } from '@angular/core';
import { FilterService } from '../../sidebar/services/filter.service';
import { ApiService } from 'src/app/shared/Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MapViewService {

  private date: Date;
  constructor(private filterService: FilterService,
    private apiService: ApiService,
    private toastrService: ToastrService) { }


  setDate(date: Date) {
    this.date = new Date(date);
  }

  getDate() {
    return this.date;
  }

  getMapViewOrders(payload) {
    this.apiService.postData('orders/day-view', payload).subscribe({
      next: (res) => {
        if (res["statusCode"] == 1000) {
          if (res["data"].length == 0) {
            this.toastrService.error(res['message']);
          }
          this.filterService.setRawData(res['data']);
        } else {
          this.toastrService.error(res['message']);
        }
      },
      error: (err) => {
        console.log(err);
        this.toastrService.error(err["message"]);
      }
    })
  }
  saveNotes(value) {
    this.apiService.postData('orders/update-notes', value).subscribe({
      next: (res) => {
        console.log(res)
        if (res["statusCode"] == 1000) {
          this.toastrService.success(res["message"])
        }
          else(console.log(res))                          
       },
      error:err=>{
        this.toastrService.error(err["message"])
        console.log(err)
      }

    })
  }

}
