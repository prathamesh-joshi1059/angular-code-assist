// AI confidence score for this refactoring: 88.83%
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { CalendarControlService } from 'src/app/features/calendar/services/calendar-control.service';
import { UserService } from 'src/app/shared/Services/user.service';
import { SidenavService } from '../../services/sidenav.service';
import { OrderService } from 'src/app/shared/Services/order.service';
import { Router } from '@angular/router';
import { SavedCalendarService } from 'src/app/features/sidebar/services/saved-calendar.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/assets/environments/environment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  currentMonth: string;
  addNewCalendarToggle: boolean;
  userName: string;
  userMail: string;
  firstLogin: boolean;
  branches: string[];
  previousMonth = '';
  currentMonthSubscription: Subscription;

  constructor(
    private msalService: MsalService,
    private calendarService: CalendarControlService,
    private userService: UserService,
    private orderService: OrderService,
    private sidenavService: SidenavService,
    private savedService: SavedCalendarService,
    private route: Router
  ) {
    /* currentMonth */
    this.currentMonthSubscription = this.calendarService.currentMonth$.subscribe((month) => {
      const newMonth = new Date(month);
      this.currentMonth = newMonth.toLocaleDateString('default', {
        year: 'numeric',
        month: 'long',
      });

      if (this.route.url === '/calendar' && this.currentMonth !== this.previousMonth) {
        this.savedService.getView(this.savedService.getBranches(), this.currentMonth);
        this.previousMonth = this.currentMonth;
      }
    });
  }

  ngOnInit() {
    this.userName = this.userService.loggedUser.name;
    this.userMail = this.userService.loggedUser.userEmail;
    this.orderService.getDefaultCalendar();

    this.sidenavService.addNewCalToggle$.subscribe((toggle) => {
      this.addNewCalendarToggle = toggle;
    });

    this.sidenavService.firstLogin$.subscribe((toggle) => {
      this.firstLogin = toggle;
    });
  }

  /* Month navigation */
  prevMonth() {
    this.calendarService.moveCalendarBackward();
  }

  nextMonth() {
    this.calendarService.moveCalendarForward();
  }

  /* logout */
  logout() {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.postLogoutUrl,
    });
    localStorage.clear();
    history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  /* Function to navigate the calendar view from day view. */
  returnMonth() {
    const m = new Date(this.currentMonth);
    const initialMonth = m.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    this.calendarService.setInitialDate(initialMonth);
    this.savedService.getView(this.savedService.getBranches(), this.currentMonth);
    this.route.navigate(['calendar']);
  }

  /* unsubscribe the currentMonth subscription */
  ngOnDestroy() {
    this.currentMonthSubscription?.unsubscribe();
  }
}

/*
Issues:
- Importing unnecessary SimpleChange and SimpleChanges
- Using non-null assertion when accessing properties of possibly undefined objects
- Missing OnDestroy interface in the class declaration
- Inconsistent use of initialization (some properties are initialized at declaration others in the constructor)
- The use of 'route' instead of 'this.route' within subscribe callback
- Improper spacing in some function definitions
*/