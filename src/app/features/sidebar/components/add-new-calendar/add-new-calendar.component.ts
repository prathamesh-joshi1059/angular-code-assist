import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/Services/user.service';
import { AddCalendarService } from '../../services/add-calendar.service';
import { BranchesDataModel } from 'src/app/models/BranchesModel';
import { SidenavService } from 'src/app/theme/services/sidenav.service';

@Component({
  selector: 'app-add-new-calendar',
  templateUrl: './add-new-calendar.component.html',
  styleUrl: './add-new-calendar.component.scss',
})
export class AddNewCalendarComponent {
  @Output() applyClicked = new EventEmitter();
  isStarFilled: boolean = false;
  isPinFilled: boolean = false;
  Regions: string[] = [];
  Areas: string[] = [];
  Branches: BranchesDataModel[] = [];
  isFirstLogin: boolean;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private addCalendarService: AddCalendarService,
    public sidenavService: SidenavService
  ) { }

  ngOnInit() {

    /* Subscribe to receive region . */
    this.addCalendarService.getBranches().subscribe(res => {
      this.Regions = res.sort();
    })
    /* Subscribe to receive filtered areas after region selection. */
    this.addCalendarService.getFilteredAreas().subscribe(filteredCities => {
      this.Areas = Array.from(new Set(filteredCities.map(item => item.area))).sort();
    });
    /* Subscribe to receive filtered branches after area selection. */
    this.addCalendarService.getFilteredBranches().subscribe(filteredBranches => {
      this.Branches = filteredBranches.sort();
    });
    // Subscribe to check if the user is logging in for the first time.
    this.sidenavService.firstLogin$.subscribe(toggle => {
      this.isFirstLogin = toggle;
    })
  }

  /* Create a new calendar addition form. */
  addNewCalendarForm = this.fb.group({
    regions: [, Validators.required],
    areas: [, Validators.required],
    branches: [, Validators.required],
    calendarName: [, Validators.required],
  });
  /*  Function to save a new calendar. */
  saveCalendar() {
    if (this.addNewCalendarForm.valid) {
      let calendar = {
        ...this.addNewCalendarForm.value,
        isDefault: this.isPinFilled,
        isFavorite: this.isStarFilled,
        userId: this.userService.loggedUser.userEmail,
      };
      this.addCalendarService.createCalendar(calendar);
    }
    else {
      this.addNewCalendarForm.markAllAsTouched();
    }
  }
  /* Call the filter area method on region selection change. */
  onRegionChange() {
    this.addCalendarService.filterArea((this.addNewCalendarForm?.controls.regions.value) ? this.addNewCalendarForm?.controls?.regions.value : []);
  }
  /* Call the filter area method on area selection change. */
  onAreaChange() {
    this.addCalendarService.filterBranches((this.addNewCalendarForm.controls.areas.value) ? this.addNewCalendarForm.controls.areas.value : []);
  }
  /*  Close the add new calendar form. */
  close() {
    this.sidenavService.updateCalToggle(false);
  }

  ngOnDestroy() {
    /* Reset form */
    this.addNewCalendarForm.reset();
  }
}
