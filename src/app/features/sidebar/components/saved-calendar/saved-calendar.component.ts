import { Component } from '@angular/core';
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
  styleUrl: './saved-calendar.component.scss',
})
export class SavedCalendarComponent {


  currentMonth: string;

  constructor(
    private orderService: OrderService,
    private toggleService: ToggleService,
    private sidenavService: SidenavService,
    private calendarControlService:CalendarControlService,
    private userService: UserService,
    private savedCaledarService: SavedCalendarService,
  ) { }


  customViews: CustomView[];
  selectedView!: CustomView;
  calendarName: string;
  isPinFilled: boolean;
  isFavorite: boolean = false;
  addNewCalendarToggle: boolean;


  ngOnInit() {
    /* Subscribe to get all calendar list and set Default as selected */
    this.orderService.calList$.subscribe({
      next: (res) => {
        this.customViews = [...res];
        const defaultView = this.customViews.find(view => view.isDefault);
        if (defaultView) {
          this.calendarName = defaultView.calendarName;
          this.isPinFilled = defaultView.isDefault;
          this.selectedView = defaultView
          this.savedCaledarService.setBranches(defaultView.branches);
        }
        this.sortCustomViews();
      },
    });
 /*  Subscribe to find weather user logging for the first time or want to add new calendar  */
    this.sidenavService.addNewCalToggle$.subscribe(toggle => {
      this.addNewCalendarToggle = toggle;
    })
 /* Subscribe to get the current month */
    this.calendarControlService.currentMonth$.subscribe((currentMonth) => {
      this.currentMonth = currentMonth;
    });
  }
/* Function to sort the custom views (favorites first) */
  sortCustomViews(){
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
    this.savedCaledarService.setBranches(value.branches);
    this.isPinFilled = value.isDefault;
    this.isFavorite = value.isFavorite;
    this.savedCaledarService.getView(this.selectedView.branches,this.currentMonth)
  }
  /* Opne placeholder */
  togglePlaceholder() {
    this.toggleService.openDrawer();
  }
/* open add new calendar form */
  add() {
    this.sidenavService.updateCalToggle(true);
  }
/* Update calendar favorite and pin  */
  updateCalendar(view, type, event){
      event.stopPropagation();
      if(type==='favourite')
        {
          view.isFavorite = !view.isFavorite;
        }else if(type==='pin'){
          this.isPinFilled = !this.isPinFilled
          view.isDefault = !view.isDefault;
        }

        let calendar = {
          userId: this.userService.loggedUser.userEmail,
          calendarName: view.calendarName,
          isDefault: view.isDefault,
          isFavorite: view.isFavorite,
        };
        /*  subscribe to get udated list of calendar*/
         this.savedCaledarService.updateCalendar(calendar).subscribe((res) => {
          this.customViews = Object.assign([],res);
          this.sortCustomViews();

        });
  }
    

}
