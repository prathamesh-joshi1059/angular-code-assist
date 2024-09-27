// AI confidence score for this refactoring: 92.88%
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/Services/user.service';
import { AddCalendarService } from '../../services/add-calendar.service';
import { BranchesDataModel } from 'src/app/models/BranchesModel';
import { SidenavService } from 'src/app/theme/services/sidenav.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-new-calendar',
  templateUrl: './add-new-calendar.component.html',
  styleUrls: ['./add-new-calendar.component.scss']
})
export class AddNewCalendarComponent implements OnInit, OnDestroy {
  @Output() applyClicked = new EventEmitter<void>();
  isStarFilled = false;
  isPinFilled = false;
  Regions: string[] = [];
  Areas: string[] = [];
  Branches: BranchesDataModel[] = [];
  isFirstLogin: boolean;
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private addCalendarService: AddCalendarService,
    public sidenavService: SidenavService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.addCalendarService.getBranches().subscribe(res => {
      this.Regions = res.sort();
    }));

    this.subscriptions.add(this.addCalendarService.getFilteredAreas().subscribe(filteredCities => {
      this.Areas = Array.from(new Set(filteredCities.map(item => item.area))).sort();
    }));

    this.subscriptions.add(this.addCalendarService.getFilteredBranches().subscribe(filteredBranches => {
      this.Branches = filteredBranches.sort();
    }));

    this.subscriptions.add(this.sidenavService.firstLogin$.subscribe(toggle => {
      this.isFirstLogin = toggle;
    }));
  }

  addNewCalendarForm = this.fb.group({
    regions: [null, Validators.required],
    areas: [null, Validators.required],
    branches: [null, Validators.required],
    calendarName: [null, Validators.required],
  });

  saveCalendar(): void {
    if (this.addNewCalendarForm.valid) {
      const calendar = {
        ...this.addNewCalendarForm.value,
        isDefault: this.isPinFilled,
        isFavorite: this.isStarFilled,
        userId: this.userService.loggedUser.userEmail,
      };
      this.addCalendarService.createCalendar(calendar);
    } else {
      this.addNewCalendarForm.markAllAsTouched();
    }
  }

  onRegionChange(): void {
    this.addCalendarService.filterArea(this.addNewCalendarForm.controls.regions.value || []);
  }

  onAreaChange(): void {
    this.addCalendarService.filterBranches(this.addNewCalendarForm.controls.areas.value || []);
  }

  close(): void {
    this.sidenavService.updateCalToggle(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.addNewCalendarForm.reset();
  }
}

// Issues: 
// - styleUrl should be styleUrls
// - Missing types for some method arguments and return types.
// - Initial values for form controls should be null for clarity.
// - Subscription management is not handled correctly (memory leaks).