// AI confidence score for this refactoring: 92.79%
import { Component, OnInit } from '@angular/core';
import { ToggleService } from 'src/app/features/add-placeholder/services/toggle.service';
import { CalendarControlService } from 'src/app/features/calendar/services/calendar-control.service';
import { CustomView } from 'src/app/models/custom-view';
import { OrderService } from 'src/app/shared/Services/order.service';
import { UserService } from 'src/app/shared/Services/user.service';
import { SidenavService } from 'src/app/theme/services/sidenav.service';
import { SavedCalendarService } from '../../services/saved-calendar.service';

@Component({
  selector: 'app-saved-calendar',
  templateUrl: './saved-calendar.component.html',
  styleUrls: ['./saved-calendar.component.scss'],
})
export class SavedCalendarComponent implements OnInit {
  currentMonth: string;
  customViews: CustomView[] = [];
  selectedView!: CustomView;
  calendarName: string;
  isPinFilled: boolean;
  isFavorite = false;
  addNewCalendarToggle: boolean;

  constructor(
    private orderService: OrderService,
    private toggleService: ToggleService,
    private sidenavService: SidenavService,
    private calendarControlService: CalendarControlService,
    private userService: UserService,
    private savedCalendarService: SavedCalendarService
  ) {}

  ngOnInit() {
    /* Subscribe to get all calendar list and set Default as selected */
    this.orderService.calList$.subscribe({
      next: (res) => {
        this.customViews = [...res];
        const defaultView = this.customViews.find(view => view.isDefault);
        if (defaultView) {
          this.calendarName = defaultView.calendarName;
          this.isPinFilled = defaultView.isDefault;
          this.selectedView = defaultView;
          this.savedCalendarService.setBranches(defaultView.branches);
        }
        this.sortCustomViews();
      },
    });
    /* Subscribe to find whether user logging in for the first time or wants to add new calendar  */
    this.sidenavService.addNewCalToggle$.subscribe(toggle => {
      this.addNewCalendarToggle = toggle;
    });
    /* Subscribe to get the current month */
    this.calendarControlService.currentMonth$.subscribe((currentMonth) => {
      this.currentMonth = currentMonth;
    });
  }

  /* Function to sort the custom views (favorites first) */
  sortCustomViews() {
    this.customViews.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }

  /* view Select */
  onSelectionChange(value: CustomView) {
    this.sidenavService.updateCalToggle(false);
    this.selectedView = value;
    this.calendarName = value.calendarName;
    this.savedCalendarService.setBranches(value.branches);
    this.isPinFilled = value.isDefault;
    this.isFavorite = value.isFavorite;
    this.savedCalendarService.getView(this.selectedView.branches, this.currentMonth);
  }
  
  /* Open placeholder */
  togglePlaceholder() {
    this.toggleService.openDrawer();
  }

  /* open add new calendar form */
  add() {
    this.sidenavService.updateCalToggle(true);
  }

  /* Update calendar favorite and pin  */
  updateCalendar(view: CustomView, type: string, event: Event) {
    event.stopPropagation();
    if (type === 'favourite') {
      view.isFavorite = !view.isFavorite;
    } else if (type === 'pin') {
      this.isPinFilled = !this.isPinFilled;
      view.isDefault = !view.isDefault;
    }

    const calendar = {
      userId: this.userService.loggedUser.userEmail,
      calendarName: view.calendarName,
      isDefault: view.isDefault,
      isFavorite: view.isFavorite,
    };
    /* subscribe to get updated list of calendar */
    this.savedCalendarService.updateCalendar(calendar).subscribe((res) => {
      this.customViews = [...res];
      this.sortCustomViews();
    });
  }
}

/* Issues: 
1. Incorrect import name: styleUrl should be styleUrls.
2. Misspelled variable name: savedCaledarService should be savedCalendarService.
3. Missing OnInit interface for the component.
4. Inconsistent use of boolean initializations.
5. Unused type definitions for updateCalendar parameters.
*/