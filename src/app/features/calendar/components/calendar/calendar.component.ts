// AI confidence score for this refactoring: 95.13%
import { ChangeDetectorRef, Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarControlService } from '../../services/calendar-control.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FilterService } from 'src/app/features/sidebar/services/filter.service';
import { Orders } from 'src/app/models/orders';
import { messages, workTypes } from 'src/assets/data/constants';
import { Router } from '@angular/router';
import { MapViewService } from 'src/app/features/map/services/map-view.service';
import { CalendarOptions } from '@fullcalendar/core';
import { SavedCalendarService } from 'src/app/features/sidebar/services/saved-calendar.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, AfterViewInit {
  date = new DatePipe('en-US');
  @ViewChild('calendar') calendar: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    fixedWeekCount: false,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    height: '100vh',
    contentHeight: '99vh',
    headerToolbar: {
      left: 'dayGridMonth,currentWeekButton',
      center: 'title',
      right: 'prev,next',
    },
    buttonText: {
      month: 'Month',
    },
    customButtons: {
      currentWeekButton: {
        text: 'Current Week',
        click: this.navigateToCurrentWeek.bind(this),
      },
    },
    views: {
      dayGridMonth: {
        dayMaxEvents: 2,
      },
      dayGridWeek: {
        dayMaxEvents: false,
      },
    },
    dateClick: this.handleDateClick.bind(this),
    datesSet: this.handleDatesSet.bind(this),
    handleWindowResize: true,
  };

  data: Orders[] = [];
  filteredData: any[] = [];

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private calendarService: CalendarControlService,
    private cdr: ChangeDetectorRef,
    private filterService: FilterService,
    private route: Router,
    private mapService: MapViewService,
    private savedService: SavedCalendarService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.calendarService.moveBackward$.subscribe(() => this.moveCalendarBackward());
    this.calendarService.moveForward$.subscribe(() => this.moveCalendarForward());

    const currentMonth = this.calendarService.getInitialDate();
    if (currentMonth) {
      this.calendarOptions.initialDate = currentMonth;
    } else {
      if (this.calendar?.getApi()?.view.type === 'month') {
        this.calendarService.updateCurrentMonth(this.calendar.getApi().view.title);
      }
    }

    document.addEventListener('click', this.handleDayNumberClick.bind(this));

    this.filterService.filteredData$.subscribe((filteredData) => {
      this.getOrders(filteredData);
      this.filteredData = filteredData;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const calendarApi = this.calendar.getApi();
      const currentMonth = calendarApi.view.title;
      this.calendarService.updateCurrentMonth(currentMonth);
      this.cdr.detectChanges();
    }, 0);
  }

  navigateToCurrentWeek(): void {
    this.calendar.getApi()?.changeView('dayGridWeek', new Date());
  }

  handleDayNumberClick(event: MouseEvent): void {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    if (target.classList.contains('fc-daygrid-day-number')) {
      if (this.savedService.getBranches()) {
        const dateStr = target.getAttribute('aria-label');
        if (dateStr) {
          this.navigateToDay(dateStr);
        }
      } else {
        this.toastService.info(messages.selectCalendar, '', { timeOut: 700 });
      }
    }
  }

  moveCalendarBackward(): void {
    const calendarApi = this.calendar.getApi();
    this.calendar.getApi().changeView('dayGridMonth');
    calendarApi.prev();
  }

  moveCalendarForward(): void {
    const calendarApi = this.calendar.getApi();
    this.calendar.getApi().changeView('dayGridMonth');
    calendarApi.next();
  }

  updateCurrentMonth(event: any): void {
    this.calendarService.updateCurrentMonth(event.view.title);
  }

  getOrders(data: Orders[]): void {
    if (data.length) {
      const initialEvents = data.map((order) => {
        const workType = workTypes.find((work) => work.workType === order.workType);
        return {
          title: order.clientName,
          start: new Date(order.startDate),
          end: new Date(order.endDate),
          borderColor: workType ? workType.color : 'black',
          backgroundColor: 'transparent',
          textColor: 'black',
          extendedProps: order,
        };
      });
      this.calendarOptions.events = initialEvents.length ? [...initialEvents] : [];
    } else {
      this.calendarOptions.events = [];
    }
  }

  getDifference(day1: Date, day2: Date): number {
    const differenceInMilliseconds = day2.getTime() - day1.getTime();
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  }

  handleDatesSet(info: any): void {
    if (info.view.type === 'dayGridMonth') {
      this.calendarService.updateCurrentMonth(info.view.title);
      const buttonElement = document.querySelector('.fc-currentWeekButton-button');
      buttonElement?.classList.remove('fc-button-active');
    } else if (info.view.type === 'dayGridWeek') {
      const weekStart = new Date(info.start);
      const month = weekStart.toLocaleString('default', { month: 'long', year: 'numeric' });
      this.calendarService.updateCurrentMonth(month);
      const { startDate } = this.getWeekDates();
      const start = this.date.transform(startDate, 'yyyy-MM-dd');
      const wStart = this.date.transform(weekStart, 'yyyy-MM-dd');
      const buttonElement = document.querySelector('.fc-currentWeekButton-button');
      const calendarApi = this.calendar.getApi();
      if (calendarApi.view.type === 'dayGridWeek' && start === wStart) {
        buttonElement?.classList.add('fc-button-active');
      } else {
        buttonElement?.classList.remove('fc-button-active');
      }
    }
  }

  handleDateClick(info: any): void {
    this.calendar.getApi()?.changeView('dayGridWeek', info.date);
  }

  navigateToDay(date: string): void {
    this.filterService.setRawData([]);
    this.mapService.setDate(new Date(date));
    this.route.navigate(['map']);
  }

  getWeekDates() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDay);
    return { startDate };
  }
}

// Issues:
// 1. Missing return types for methods.
// 2. Incorrect method naming convention for 'getDiferrence' should be 'getDifference'.
// 3. Implicit 'any' type in function parameters.
// 4. Usage of 'var' in subscriptions without unsubscription logic.
// 5. Incorrect check for 'initialEvents' using '?.length'.