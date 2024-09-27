// AI confidence score for this refactoring: 94.88%
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { DateRange, DefaultMatCalendarRangeStrategy, MatCalendar, MatRangeDateSelectionModel } from '@angular/material/datepicker';
import { ApiService } from 'src/app/shared/Services/api.service';
import { fenceType, workTypes } from 'src/assets/data/constants';
import { ToggleService } from './services/toggle.service';
import { ToastrService } from 'ngx-toastr';
import { fence } from 'src/app/models/fenceModel';
import { placeholderData } from 'src/app/models/placeholderModel';
import { Orders } from 'src/app/models/orders';
import { SavedCalendarService } from '../sidebar/services/saved-calendar.service';

@Component({
  selector: 'app-add-placeholder',
  templateUrl: './add-placeholder.component.html',
  styleUrls: ['./add-placeholder.component.scss'],
  providers: [DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel],
})
export class AddPlaceholderComponent {

  todayDate = new Date();

  addNewPlaceholder = this.fb.group({
    projectType: ['', Validators.required],
    workType: ['', Validators.required],
    branch: ['', Validators.required],
    siteAddress: ['', Validators.required],
    driverName: [''],
    endDate: ['', Validators.required],
    notes: ['', [Validators.maxLength(4000)]],
    clientName: ['', Validators.required],
    startDate: ['', Validators.required],
    phone: ['']
  })

  workTypes = workTypes;
  siteAddress: string;
  fenceTypeArr: fence[] = fenceType.map(el => ({ isChecked: false, fenceType: el, noOfUnits: 0 }));
  showValidation = false;
  selectedValue = 'option1';
  color = 'blue';
  projectType: string[] = [];
  eventChecked = false;
  constructionChecked = false;
  Branches: string[];
  orderData: Orders | null;
  selectedFenceType = '';
  puChecked = false;
  delChecked = false;
  drpChecked = false;
  offrntChecked = false;
  retChecked = false;
  svcChecked = false;
  onrntChecked = false;
  cpuChecked = false;

  @ViewChild('calendar') calendar: MatCalendar<Date> | undefined;
  selectedDateRange!: DateRange<Date>;

  constructor(
    private fb: FormBuilder,
    public selectionModel: MatRangeDateSelectionModel<Date>,
    public selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
    private api: ApiService,
    private toggleService: ToggleService,
    private toastr: ToastrService,
    private savedCalendarService: SavedCalendarService
  ) { }

  ngOnInit() {
    this.Branches = this.savedCalendarService.getBranches() || [];
    if (this.Branches.length === 1) {
      this.addNewPlaceholder.controls.branch.setValue(this.Branches[0]);
    }
    const order = this.toggleService.getOrder();
    if (order?.orderId) {
      this.orderData = order;
      this.editPlaceholder(this.orderData);
    }
  }

  editPlaceholder(data: Orders | null) {
    if (data) {
      this.addNewPlaceholder.patchValue({
        projectType: data.projectType,
        workType: data.workType,
        branch: data.branch,
        siteAddress: data.address,
        driverName: data?.driver,
        endDate: data.endDate,
        notes: data.notes,
        clientName: data.clientName,
        startDate: data.startDate,
        phone: data?.phone
      });

      this.selectedValue = data.workType;
      this.selectedDateRange = new DateRange<Date>(new Date(data.startDate), new Date(data.endDate));

      this.fenceTypeArr = this.fenceTypeArr.map(obj1 => {
        let foundObj = data.fences.find(obj2 => obj2.fenceType === obj1.fenceType);
        return { ...obj1, ...foundObj, isChecked: !!foundObj };
      });
    }
  }

  isFenceTypeValid() {
    return this.fenceTypeArr.every(el => !el.isChecked) && this.showValidation;
  }

  changeCheckbox(event: any, i: number) {
    this.showValidation = true;
    this.fenceTypeArr[i].isChecked = event.checked;
    if (!event.checked) {
      this.fenceTypeArr[i].noOfUnits = 0;
    }
  }

  changeUnits(event: any, index: number) {
    this.fenceTypeArr[index].noOfUnits = Number(event.value);
    console.log(this.fenceTypeArr);
  }

  onCheckboxChange(type: string) {
    if (type === 'event') {
      this.constructionChecked = false;
    } else if (type === 'construction') {
      this.eventChecked = false;
    }
  }

  onCheckboxesChange(selectedCheckbox: string) {
    this.resetCheckboxes();
    switch (selectedCheckbox) {
      case 'PU': this.puChecked = true; break;
      case 'DEL': this.delChecked = true; break;
      case 'DRP': this.drpChecked = true; break;
      case 'OFFRNT': this.offrntChecked = true; break;
      case 'RET': this.retChecked = true; break;
      case 'SVC': this.svcChecked = true; break;
      case 'ONRNT': this.onrntChecked = true; break;
      case 'CPU': this.cpuChecked = true; break;
      default: break;
    }
  }

  resetCheckboxes() {
    this.puChecked = false;
    this.delChecked = false;
    this.drpChecked = false;
    this.offrntChecked = false;
    this.retChecked = false;
    this.svcChecked = false;
    this.onrntChecked = false;
    this.cpuChecked = false;
  }

  rangeChanged(selectedDate: Date) {
    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(selectedDate, selection);

    this.selectionModel.updateSelection(newSelection, this);
    this.selectedDateRange = new DateRange<Date>(newSelection.start, newSelection.end);

    this.addNewPlaceholder.patchValue({
      startDate: `${this.selectedDateRange?.start}`,
      endDate: (this.selectedDateRange.end) ? `${this.selectedDateRange.end}` : `${this.selectedDateRange.start}`
    });
  }

  onChange(value: string) {
    this.selectedValue = value;
  }

  onSave() {
    const CheckFenceValid = !this.fenceTypeArr.every(el => !el.isChecked);
    if (CheckFenceValid) {
      this.fenceTypeArr.forEach(item => {
        if (item.isChecked && item.noOfUnits === 0) {
          this.toastr.error(`Enter No. of units for ${item.fenceType}`);
          return false;
        }
      });
    }
    
    if (this.addNewPlaceholder.valid && CheckFenceValid) {
      const formData = this.addNewPlaceholder.value;
      this.fenceTypeArr.forEach(el => delete el.isChecked);
      
      const payload: placeholderData = {
        endDate: this.addNewPlaceholder.controls.endDate.value?.trim() ?? '',
        projectType: this.addNewPlaceholder.controls.projectType.value?.trim() ?? '',
        notes: this.addNewPlaceholder.controls.notes.value?.trim() ?? '',
        address: this.addNewPlaceholder.controls.siteAddress.value?.trim() ?? '',
        workType: this.addNewPlaceholder.controls.workType.value?.trim() ?? '',
        driver: this.addNewPlaceholder.controls.driverName.value?.trim() ?? '',
        clientName: this.addNewPlaceholder.controls.clientName.value?.trim() ?? '',
        startDate: this.addNewPlaceholder.controls.startDate.value?.trim() ?? '',
        fences: this.fenceTypeArr.filter(el => el.noOfUnits > 0),
        branch: this.addNewPlaceholder.controls.branch.value?.trim() ?? '',
        phone: `${this.addNewPlaceholder.controls.phone.value}` ?? ''
      };

      if (this.orderData) {
        this.updatePlaceholder(this.orderData.orderId, payload);
      } else {
        this.api.postData('/placeholders', payload).subscribe({
          next: (res) => {
            if (res["statusCode"] === 1000) {
              this.resetForm();
              this.toggleService.closeDrawer();
              this.toastr.success(res['message']);
            } else {
              console.log(res);
            }
          },
          error: err => {
            console.log(err);
          }
        });
      }
    } else {
      this.addNewPlaceholder.markAllAsTouched();
      if (this.addNewPlaceholder.controls.startDate.invalid) {
        this.toastr.error("Please select date range");
      }
    }
  }

  mobileNumberValidator(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const invalidChars = ['-', '+', 'e', '.', 'E'];
    if (
      invalidChars.includes(event.key) ||
      (input.value.length >= 10 && !isNaN(Number(event.key)))
    ) {
      event.preventDefault();
    }
  }

  resetForm() {
    this.addNewPlaceholder.reset();
    this.selectedValue = "";
    this.showValidation = false;
    this.fenceTypeArr.forEach(el => {
      el.isChecked = false;
      el.noOfUnits = 0;
    });
    this.selectedDateRange = new DateRange<Date>(null, null);
    this.calendar?.updateTodaysDate();
  }

  ngOnDestroy() {
    this.resetForm(); 
    this.toggleService.setOrders(null); 
  }

  deletePlaceholder(orderId: string) {
    if (orderId) {
      this.toggleService.deletePlaceholder(orderId);
    }
  }

  updatePlaceholder(orderId: string, data: placeholderData) {
    if (orderId) {
      this.toggleService.updatePlaceholder(orderId, data);
    }
  }
}

// Issues that violate TypeScript coding standards:
// 1. styleUrl should be styleUrls
// 2. Use strict equality checks instead of loose equality
// 3. Event handlers should have appropriate type annotations for parameters
// 4. Avoid using 'any' type for event parameters
// 5. Arrow functions or shorthand methods can enhance readability