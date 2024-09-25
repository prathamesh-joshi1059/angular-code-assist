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
  styleUrl: './add-placeholder.component.scss',
  providers: [DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel],

})
export class AddPlaceholderComponent {

  todayDate = new Date();

// Creating a form group for 'addNewPlaceholder' with FormBuilder
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

// Method to edit an existing placeholder with the given data
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
        phone:data?.phone
      });

      this.selectedValue = data.workType;
      this.selectedDateRange = new DateRange<Date>(new Date(data.startDate), new Date(data.endDate));

      this.fenceTypeArr = this.fenceTypeArr.map(obj1 => {
        let foundObj = data.fences.find(obj2 => obj2.fenceType === obj1.fenceType);
        if (foundObj) {
          return { ...obj1, ...foundObj, isChecked: true };
        } else {
          return { ...obj1, isChecked: false }
        }
      });
    }
  }

  workTypes = workTypes
  siteAddress: string;

  // Array to store fence types, initializing each fence object with isChecked as false, fenceType from the map, and noOfUnits as 0
  fenceTypeArr: fence[] = fenceType.map(el => { return { isChecked: false, fenceType: el, noOfUnits: 0 } });
  showValidation = false;

// Method to check if the fence type selection is valid
  isFenceTypeValid() {
    return (this.fenceTypeArr.every(el => el.isChecked == false) && this.showValidation)
  }
// Method to handle checkbox change event for fence types
  changeCheckbox(event, i) {
    this.showValidation = true
    this.fenceTypeArr[i].isChecked = event.checked
    if (!event.checked) {
      this.fenceTypeArr[i].noOfUnits = 0;
    }
  }
  // Method to handle the change event for the number of units for a specific fence type
  changeUnits(event, index) {
    this.fenceTypeArr[index].noOfUnits = parseInt(event.value)
    console.log(this.fenceTypeArr);
  }
// Constructor for initializing dependencies and services
  constructor(private fb: FormBuilder,
    public selectionModel: MatRangeDateSelectionModel<Date>,
    public selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
    private api: ApiService,
    private toggleService: ToggleService,
    private toastr: ToastrService,
    private savedCalendarService: SavedCalendarService
  ) {

  }
// Array to store project types as strings
  projectType: string[] = [];

// Boolean flag to indicate whether the event option is checked
  eventChecked = false;
// Boolean flag to indicate whether the construction option is checked
  constructionChecked = false;

  Branches: string[];
  // Holds data for a single order, initialized as null
  orderData: Orders | null;
// Lifecycle hook called after Angular has initialized all data-bound properties.
  ngOnInit() {
    if (this.savedCalendarService.getBranches()?.length) {
      this.Branches = this.savedCalendarService.getBranches();
      if (this.Branches.length == 1) {
        this.addNewPlaceholder.controls?.branch?.setValue(this.Branches[0])
      }
      console.log(this.toggleService.getOrder())
    }
    if (this.toggleService.getOrder()?.orderId) {
      this.orderData = this.toggleService.getOrder();
      this.editPlaceholder(this.orderData)
    }

  }
// Method to handle checkbox changes based on the type provided ('event' or 'construction')
  onCheckboxChange(type: string) {

    if (type === 'event') {
      this.constructionChecked = false;
    } else if (type === 'construction') {
      this.eventChecked = false;
    }
  }
// Boolean flags for checkboxes
  puChecked = false;
  delChecked = false;
  drpChecked = false;
  offrntChecked = false;
  retChecked = false;
  svcChecked = false;
  onrntChecked = false;
  cpuChecked = false;

// Method to handle changes in checkbox selection based on the selected checkbox type
  onCheckboxesChange(selectedCheckbox: string) {

    console.log(this.addNewPlaceholder.value)
    this.resetCheckboxes();
    switch (selectedCheckbox) {
      case 'PU':
        this.puChecked = true;
        break;
      case 'DEL':
        this.delChecked = true;
        break;
      case 'DRP':
        this.drpChecked = true;
        break;
      case 'OFFRNT':
        this.offrntChecked = true;
        break;
      case 'RET':
        this.retChecked = true;
        break;
      case 'SVC':
        this.svcChecked = true;
        break;
      case 'ONRNT':
        this.onrntChecked = true;
        break;
      case 'CPU':
        this.cpuChecked = true;
        break;
      default:
        break;
    }
  }
// Method to reset all checkbox flags to false
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

// Holds the currently selected fence type as a string
  selectedFenceType: string = '';



  // fenceCheckbox(selectedType: string) {

  //   if (this.selectedFenceType === selectedType) {

  //     this.selectedFenceType = '';
  //   } else {

  //     this.selectedFenceType = selectedType;
  //   }

  // }


// ViewChild decorator to get a reference to the MatCalendar component
  @ViewChild('calendar') calendar: MatCalendar<Date> | undefined;

// Holds the selected date range as a DateRange object
  selectedDateRange!: DateRange<Date>;

// Method to handle changes in the selected date range
  rangeChanged(selectedDate: Date) {

    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(
        selectedDate,
        selection
      );

    this.selectionModel.updateSelection(newSelection, this);
    this.selectedDateRange = new DateRange<Date>(
      newSelection.start,
      newSelection.end
    );

    this.addNewPlaceholder.patchValue({
      startDate: `${this.selectedDateRange?.start}`,
      endDate: (this.selectedDateRange.end) ? `${this.selectedDateRange.end}` : `${this.selectedDateRange.start}`
    })
  }
// Holds the currently selected value, initialized to 'option1'
  selectedValue: string = 'option1';
  color: string = 'blue';
// Method to update the selectedValue based on the provided value
  onChange(value: string) {
    this.selectedValue = value;
  }
// Method to validate and save fence data
  onSave() {
    let CheckFenceValid: boolean;
    // Check if no fence types are selected
    if (this.fenceTypeArr.every(el => el.isChecked == false)) {
      this.showValidation = true;
      CheckFenceValid = false;
    } else {
      CheckFenceValid = true;
    }
   // Iterate through each fence type
    this.fenceTypeArr.forEach(item => {
      if (item.isChecked == true && item.noOfUnits == 0) {
        this.toastr.error(`Enter No. of units for ${item.fenceType}`);
        CheckFenceValid = false;
      } else {
        CheckFenceValid = true;
      }
    })
// Check if the form is valid and fence data is valid
    if (this.addNewPlaceholder.valid && CheckFenceValid) {

      const formData = this.addNewPlaceholder.value

      this.fenceTypeArr.map(el => {
        delete el.isChecked
      })
// Constructing payload object with trimmed values from form controls and filtered fence data
      let payload: placeholderData = {
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
        phone:`${ this.addNewPlaceholder.controls.phone.value}` ?? ''
      }

      if (this.orderData) {
        this.updatePlaceholder(this.orderData.orderId, payload);
      } else {
        this.api.postData('/placeholders', payload).subscribe({
          next: (res) => {
            console.log(res)
            if (res["statusCode"] == 1000) {
              this.resetForm()
              this.toggleService.closeDrawer();
              this.toastr.success(res['message'])
            }

            else (console.log(res))
          },
          error: err => {
            console.log(err)
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
// Function to validate mobile number input during keyboard events
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

// Method to reset the form and related state variables
  resetForm() {
    this.addNewPlaceholder.reset();
    this.selectedValue = "";
    this.showValidation = false;
    this.fenceTypeArr.forEach(el => {
      el.isChecked = false,
        el.noOfUnits = 0
    });
    this.selectedDateRange = new DateRange<Date>(null, null);
    this.calendar?.updateTodaysDate();
  }
// Cleanup logic when the component is about to be destroyed
  ngOnDestroy() {
    this.resetForm(); // Reset form and related state variables
    this.toggleService.setOrders(null); // Clear orders in the toggleService
  }
// Method to delete a placeholder using the orderId
  deletePlaceholder(orderId: string) {
    if (orderId) {
      this.toggleService.deletePlaceholder(orderId)
    }
  }
// Method to update a placeholder using the orderId
  updatePlaceholder(orderId: string, data: placeholderData) {
    if (orderId) {
      this.toggleService.updatePlaceholder(orderId, data)
    }
  }


}




