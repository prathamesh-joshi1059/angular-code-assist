import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { MapViewService } from 'src/app/features/map/services/map-view.service';
import { FilterService } from 'src/app/features/sidebar/services/filter.service';
import { HttpClientModule } from '@angular/common/http';
import { OrderService } from 'src/app/shared/Services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarControlService } from '../../services/calendar-control.service';
import { MsalService } from '@azure/msal-angular';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { Orders } from 'src/app/models/orders';
import { ToastrService } from 'ngx-toastr';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let calendarControlService: CalendarControlService;
  let filterService: FilterService;
  let orderService: OrderService;
  let router: Router;
  let mapViewService: MapViewService;
  let msalServiceSpy: jasmine.SpyObj<MsalService>;

  const calendarApiSpy: any = {
    view: { type: 'month', title: 'January 2022' },
  };

  beforeEach(async () => {
    const msalServiceSpyObj = jasmine.createSpyObj('MsalService', [
      'method1',
      'method2',
    ]);
    const toastrServiceSpyObj = jasmine.createSpyObj('ToastrService',['success','error', 'info'])

    await TestBed.configureTestingModule({
      declarations: [CalendarComponent, FullCalendarComponent],
      providers: [
        MapViewService,
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        { provide: FullCalendarComponent, useValue: calendarApiSpy },
        {provide: ToastrService, useValue: toastrServiceSpyObj},

        MapViewService,
        CalendarControlService,
        FilterService,
        OrderService,
        { provide: MsalService, useValue: msalServiceSpyObj },
      ],
      imports: [HttpClientModule, FullCalendarModule],
    });

    fixture = TestBed.createComponent(CalendarComponent);
    calendarControlService = TestBed.inject(CalendarControlService);
    filterService = TestBed.inject(FilterService);
    orderService = TestBed.inject(OrderService);
    router = TestBed.inject(Router);
    mapViewService = TestBed.inject(MapViewService);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  const mockData: Orders[] = [
    
  ];

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.calendarOptions.initialView).toEqual('dayGridMonth');
  });

  //ngOnInit
  it('should call getOrders on init', () => {
    spyOn(component, 'getOrders');
    component.ngOnInit();
    expect(component.getOrders).toHaveBeenCalled();
  });

  it('should call moveCalendarBackward when moveBackward$ emits', () => {
    spyOn(component, 'moveCalendarBackward');
    calendarControlService.moveBackward$.subscribe(() => {
      expect(component.moveCalendarBackward).toHaveBeenCalled();
    });
  });

  it('should call moveCalendarForward when moveForward$ emits', () => {
    spyOn(component, 'moveCalendarForward');
    calendarControlService.moveForward$.subscribe(() => {
      expect(component.moveCalendarForward).toHaveBeenCalled();
    });
  });

  it('should set initialDate in calendarOptions when getInitialDate returns a valid date', () => {
    const currentDate = new Date('2022-01-01');
    spyOn(calendarControlService, 'getInitialDate').and.returnValue(
      currentDate.toString()
    );
    const updateCurrentMonthSpy = spyOn(
      calendarControlService,
      'updateCurrentMonth'
    );

    component.ngOnInit();

    expect(component.calendarOptions.initialDate).toEqual(currentDate);
    expect(updateCurrentMonthSpy).not.toHaveBeenCalled();
  });

  it('should call updateCurrentMonth with correct month title when getInitialDate returns null and view type is "month"', () => {
    // const calendarApiSpy:any = { view: { type: 'month', title: 'January 2022' } };
    spyOn(calendarControlService, 'getInitialDate').and.returnValue('');
    spyOn(component.calendar, 'getApi').and.returnValue(calendarApiSpy);
    const updateCurrentMonthSpy = spyOn(
      calendarControlService,
      'updateCurrentMonth'
    );

    component.ngOnInit();

    expect(component.calendarOptions.initialDate).toBeUndefined();
    expect(updateCurrentMonthSpy).toHaveBeenCalledWith('January 2022');
  });

  it('should call handleDateClick() with correct parameters on day grid cell click', () => {
    const mockEvent = { date: new Date('2022-06-15') };
    spyOn(component, 'handleDateClick').and.callThrough();
    component.handleDateClick(mockEvent);
    expect(component.handleDateClick).toHaveBeenCalled();
    expect(component.handleDateClick).toHaveBeenCalledWith(mockEvent);
  });

  it('should change the view to dayGridWeek on day grid cell click', () => {
    const mockEvent = { date: new Date('2022-06-15') };
    spyOn(component.calendar.getApi(), 'changeView').and.callThrough();
    component.handleDateClick(mockEvent);

    fixture.detectChanges();
    expect(component.calendar.getApi().changeView).toHaveBeenCalledWith(
      'dayGridWeek',
      mockEvent.date
    );

    const calendarElement = fixture.debugElement.query(
      By.css('.fc-dayGridWeek-view')
    );
    expect(calendarElement).toBeTruthy();
  });

  it('should move calendar backward', () => {
    const moveCalendarBackwardSpy = spyOn(component.calendar.getApi(), 'prev');
    component.moveCalendarBackward();
    expect(moveCalendarBackwardSpy).toHaveBeenCalled();
  });

  it('should move calendar forward', () => {
    const moveCalendarForwardSpy = spyOn(component.calendar.getApi(), 'next');
    component.moveCalendarForward();
    expect(moveCalendarForwardSpy).toHaveBeenCalled();
  });

  it('should not change the calendar view while navigating backword', () => {
    const moveCalendarSpy = spyOn(component.calendar.getApi(), 'changeView');
    component.moveCalendarBackward();
    expect(moveCalendarSpy).toHaveBeenCalledWith('dayGridMonth');
  });

  it('should not change the calendar view while navigating backword', () => {
    const moveCalendarSpy = spyOn(component.calendar.getApi(), 'changeView');
    component.moveCalendarForward();
    expect(moveCalendarSpy).toHaveBeenCalledWith('dayGridMonth');
  });

  it('should update current month', () => {
    const month = 'June 2024';
    const updateCurrentMonthSpy = spyOn(
      calendarControlService,
      'updateCurrentMonth'
    );

    calendarControlService.updateCurrentMonth(month);

    expect(updateCurrentMonthSpy).toHaveBeenCalledWith(month);
  });
 
  it('should handle empty data', () => {
    const orderSpy=orderService.ordersData$.subscribe(()=>{
      let orders=[];
      return (of(orders))
    })

    component.getOrders(mockData);

    expect(component.calendarOptions.events).toEqual([]);
  });
  
  //getDifferenece
  it('should return a positive number when day1 is before day2', () => {
    const day1 = new Date('2022-01-01');
    const day2 = new Date('2022-01-05');
    const getDifferenceSpy = spyOn(
      component,
      'getDiferrence'
    ).and.callThrough();
    component.getDiferrence(day1, day2);
    const result = getDifferenceSpy(day1, day2);
    expect(result).toBeGreaterThan(0);
  });

  it('should return a negative number when day1 is after day2', () => {
    const day1 = new Date('2022-01-05');
    const day2 = new Date('2022-01-01');
    const getDifferenceSpy = spyOn(
      component,
      'getDiferrence'
    ).and.callThrough();
    component.getDiferrence(day1, day2);
    const result = getDifferenceSpy(day1, day2);
    expect(result).toBeLessThan(0);
  });

  it('should return 0 when day1 and day2 are the same day', () => {
    const day1 = new Date('2022-01-01');
    const day2 = new Date('2022-01-01');
    const getDifferenceSpy = spyOn(
      component,
      'getDiferrence'
    ).and.callThrough();
    component.getDiferrence(day1, day2);
    const result = getDifferenceSpy(day1, day2);
    expect(result).toBe(0);
  });

  //handleDatesSet
  it('should update current month when view type is dayGridMonth', () => {
    const info = { view: { type: 'dayGridMonth', title: 'January 2022' } };
    const handleDateClickSpy = spyOn(
      component,
      'handleDatesSet'
    ).and.callThrough();
    const updateCurrentMonthSpy = spyOn(
      calendarControlService,
      'updateCurrentMonth'
    );
    component.handleDatesSet(info);

    expect(handleDateClickSpy).toHaveBeenCalledWith(info);
    expect(updateCurrentMonthSpy).toHaveBeenCalledWith(info.view.title);
  });

  it('should update current month to start of the week when view type is dayGridWeek', () => {
    const info = {
      view: { type: 'dayGridWeek' },
      start: '2024-06-15T18:30:00.000Z',
    };
    const weekStart = new Date(info.start);
    const month = weekStart.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    const handleDateClickSpy = spyOn(
      component,
      'handleDatesSet'
    ).and.callThrough();
    const updateCurrentMonthSpy = spyOn(
      calendarControlService,
      'updateCurrentMonth'
    ).and.callThrough();

    component.handleDatesSet(info);
    expect(updateCurrentMonthSpy).toHaveBeenCalledWith(month);
  });

  //handleDateClick
  it('should update current month when view type is dayGridMonth', () => {
    const info = { date: 'Wed Jun 12 2024 00:00:00 GMT+0530' };
    const handleDateClickSpy = spyOn(component.calendar.getApi(), 'changeView');
    component.handleDateClick(info);
    expect(handleDateClickSpy).toHaveBeenCalledWith('dayGridWeek', info.date);
  });

  //navigateToDay
  it('should set the date in the map service and navigate to the "map" route', () => {
    const date = '2022-01-01';
    const navigateSpy = spyOn(router, 'navigate');
    const setDateSpy = spyOn(mapViewService, 'setDate');

    component.navigateToDay(date);

    expect(setDateSpy).toHaveBeenCalledWith(new Date(date));
    expect(navigateSpy).toHaveBeenCalledWith(['map']);
  });
});
