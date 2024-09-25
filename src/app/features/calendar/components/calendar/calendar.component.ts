import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
export class CalendarComponent {
  date = new DatePipe('en-US');

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

  /* ViewChild to access the calendar component */
  @ViewChild('calendar') calendar: FullCalendarComponent;

  /* calendarOptions */
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

  //navigate to current month.
  navigateToCurrentWeek(info) {
    this.calendar.getApi()?.changeView('dayGridWeek', new Date());
  }

  data: Orders[] = [];
  filteredData: any[] = [];

  ngOnInit() {
    /* months navigation */
    this.calendarService.moveBackward$.subscribe(() => {
      this.moveCalendarBackward();
    });

    this.calendarService.moveForward$.subscribe(() => {
      this.moveCalendarForward();
    });

    /*     set the month to the calendar view. */
    const currentMonth = this.calendarService.getInitialDate();
    if (currentMonth) {
      this.calendarOptions.initialDate = currentMonth;
    } else {
      if (this.calendar?.getApi()?.view.type === 'month') {
        this.calendarService.updateCurrentMonth(
          this.calendar.getApi().view.title
        );
      }
    }

    /* dayNumber handling */
    document.addEventListener('click', (event) => {
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
    });

    /* Call getOrders() to set the data to calendar view  */
    this.filterService.filteredData$.subscribe((filteredData) => {
      this.getOrders(filteredData);
      this.filteredData = filteredData;
    });
  }

  /* After the view has been initialized, update the current month and detect changes to reflect the updated month. */
  ngAfterViewInit() {
    setTimeout(() => {
      const calendarApi = this.calendar.getApi();
      const currentMonth = calendarApi.view.title;
      this.calendarService.updateCurrentMonth(currentMonth);
      this.cdr.detectChanges();
    }, 0);
  }

  /* Month navigation */
  moveCalendarBackward() {
    const calendarApi = this.calendar.getApi();
    this.calendar.getApi().changeView('dayGridMonth');

    calendarApi.prev();
  }

  moveCalendarForward() {
    const calendarApi = this.calendar.getApi();
    this.calendar.getApi().changeView('dayGridMonth');
    calendarApi.next();
  }

  /* Update current month to calendar view */
  updateCurrentMonth(event) {
    this.calendarService.updateCurrentMonth(event.view.title);
  }

  /* function to assign the orders to calendarOptions */
  getOrders(data: Orders[]) {
    if (data.length) {
      let initialEvents = data.map((order) => {
        let workType = workTypes.find(
          (work) => work.workType === order.workType
        );
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
      if (initialEvents?.length) {
        this.calendarOptions.events = Object.assign([], initialEvents);
      }
    } else {
      this.calendarOptions.events = [];
    }
  }

  /* total days calculation for order */
  getDiferrence(day1: Date, day2: Date) {
    const date1 = new Date(day1);
    const date2 = new Date(day2);

    const differenceInMilliseconds = date2.getTime() - date1.getTime();
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  }

  /* Handle changed calendarView */
  handleDatesSet(info) {
    if (info.view.type == 'dayGridMonth') {
      this.calendarService.updateCurrentMonth(info.view.title);

      /* remove active class from currentWeek button */
      const buttonElement = document.querySelector(
        '.fc-currentWeekButton-button'
      );
      buttonElement?.classList.remove('fc-button-active');
    } else if (info.view.type === 'dayGridWeek') {
      const weekStart = new Date(info.start);
      const month = weekStart.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      this.calendarService.updateCurrentMonth(month);

      /* Add style for currentWeek button. */
      const { startDate } = this.getWeekDates();
      const start = this.date.transform(startDate, 'yyyy-MM-dd');
      const wStart = this.date.transform(weekStart, 'yyyy-MM-dd');
      const buttonElement = document.querySelector(
        '.fc-currentWeekButton-button'
      );
      const calendarApi = this.calendar.getApi();
      if (calendarApi.view.type === 'dayGridWeek' && start == wStart) {
        buttonElement?.classList.add('fc-button-active');
      } else {
        buttonElement?.classList.remove('fc-button-active');
      }
    }
  }

  /*   handle the day click */
  handleDateClick(info) {
    this.calendar.getApi()?.changeView('dayGridWeek', info.date);
  }

  /* navigate to the day view */
  navigateToDay(date: string) {
    this.filterService.setRawData([]);
    this.mapService.setDate(new Date(date));
    this.route.navigate(['map']);
  }

  /* Get the start date of the current week */
  getWeekDates() {
    let currentDate = new Date();
    let currentDay = currentDate.getDay();

    let startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDay);

    return { startDate };
  }
}
