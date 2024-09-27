// AI confidence score for this refactoring: 85.22%
import { Injectable } from '@angular/core';
import { FilterService } from '../../sidebar/services/filter.service';
import { ApiService } from 'src/app/shared/Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MapViewService {

  private date!: Date; // Using definite assignment operator
  constructor(private filterService: FilterService,
              private apiService: ApiService,
              private toastrService: ToastrService) { }

  setDate(date: Date): void { // Specified return type
    this.date = new Date(date);
  }

  getDate(): Date { // Specified return type
    return this.date;
  }

  getMapViewOrders(payload: any): void { // Specified parameter type and return type
    this.apiService.postData('orders/day-view', payload).subscribe({
      next: (res) => {
        if (res.statusCode === 1000) { // Use strict equality
          if (res.data.length === 0) { // Use strict equality
            this.toastrService.error(res.message);
          }
          this.filterService.setRawData(res.data);
        } else {
          this.toastrService.error(res.message);
        }
      },
      error: (err) => {
        console.error(err); // Using console.error for error logging 
        this.toastrService.error(err.message);
      }
    });
  }

  saveNotes(value: any): void { // Specified parameter type and return type
    this.apiService.postData('orders/update-notes', value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.statusCode === 1000) { // Use strict equality
          this.toastrService.success(res.message);
        } else {
          console.log(res);
        }
      },
      error: (err) => {
        this.toastrService.error(err.message);
        console.error(err); // Using console.error for error logging
      }
    });
  }
}

// Issues that violate TypeScript coding standards:
// 1. Missing return types for methods
// 2. Using '==' instead of '===' for equality comparison
// 3. Not using 'console.error' for logging errors
// 4. Missing explicit types for parameters
// 5. Using "res["key"]" instead of "res.key" for property access
// 6. Using implicit any for the payload and value parameters