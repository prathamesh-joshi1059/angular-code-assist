import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { MapViewComponent } from './map-view.component';
import { ToastrService } from 'ngx-toastr';
import { MapViewService } from '../../services/map-view.service';
import { CalendarControlService } from 'src/app/features/calendar/services/calendar-control.service';
import { SavedCalendarService } from 'src/app/features/sidebar/services/saved-calendar.service';
import { ToggleService } from 'src/app/features/add-placeholder/services/toggle.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FilterService } from 'src/app/features/sidebar/services/filter.service';

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;
  let toastrService: ToastrService;
  let mapViewServiceSpy: MapViewService;
  let calendarControlServiceSpy: CalendarControlService;
  let savedCalendarServiceSpy: SavedCalendarService;
  let filterServiceSpy: FilterService;

  const toastrServiceStub = {
    success: (message: string) => { },
    error: (message: string) => { },
    info: (message: string) => { }
  };

  beforeEach(async () => {

    // Mock the Google Maps API
    const google = {
      maps: {
        LatLngBounds: class { },
        Animation: {
          BOUNCE: 1,
          DROP: 2,
          animation: 3,
        },
        places: {
          Autocomplete: class {
            addListener() { }
            setComponentRestrictions() { }
          },
        },
        Map: class {
          fitBounds() { }
        },
      },
    };
    // Assign the mock to the global window object
    (window as any).google = google;

    await TestBed.configureTestingModule({
      declarations: [MapViewComponent],
      providers: [MapViewService, CalendarControlService, SavedCalendarService, ToggleService, ToastrService,
        { provide: ToastrService, useValue: toastrServiceStub }],
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule,],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapViewComponent);
    mapViewServiceSpy = TestBed.inject(MapViewService);
    calendarControlServiceSpy = TestBed.inject(CalendarControlService);
    savedCalendarServiceSpy = TestBed.inject(SavedCalendarService);
    filterServiceSpy = TestBed.inject(FilterService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set branches and date', () => {
    spyOn(mapViewServiceSpy, 'getDate').and.returnValue(new Date('2024-06-10'));
    spyOn(savedCalendarServiceSpy, 'getBranches').and.returnValue(['NYC', 'MEL']);
    component.ngOnInit();
    expect(component.branches).toEqual(['NYC', 'MEL']);
    expect(component.date).toEqual(new DatePipe('en-US'));
  });

  it('should get orders for day', () => {
    spyOn(mapViewServiceSpy, 'getMapViewOrders');
    component.getOrders(new Date('2024-06-10'));
    expect(mapViewServiceSpy.getMapViewOrders).toHaveBeenCalled();
    filterServiceSpy.filteredData$.subscribe(filteredData => {
      expect(component.dataSource).toEqual(filteredData);
    });
  });

  it('should change to next day with perticular days data', () => {
    spyOn(calendarControlServiceSpy, 'selectedMonth');
    spyOn(component, 'getOrders');
    expect(calendarControlServiceSpy.selectedMonth).toHaveBeenCalledWith(component.day);
    expect(component.getOrders).toHaveBeenCalledWith(component.day);
  });
  it('should change to previous day with perticular days data', () => {
    spyOn(calendarControlServiceSpy, 'selectedMonth');
    spyOn(component, 'getOrders');
    component.prevDate(component.day);
    expect(calendarControlServiceSpy.selectedMonth).toHaveBeenCalledWith(component.day);
    expect(component.getOrders).toHaveBeenCalledWith(component.day);
  });

  it('should add pins to markers based on workType', () => {
    const workTypes = [
      { workType: 'type1', pin: 'pin1.png' },
      { workType: 'type2', pin: 'pin2.png' }
    ];
  })

});


declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// // Mock Google Maps API
// const googleMock = {
//   maps: {
//     Map: function () {
//       return {
//         setCenter: () => { },
//         setZoom: () => { },
//         fitBounds: () => { },
//         addListener: () => { },
//         googleMap: {
//           fitBounds: () => { }
//         }
//       };
//     },
//     Marker: function () {
//       return {
//         setMap: () => { },
//         setPosition: () => { },
//       };
//     },
//     LatLng: function () { },
//     event: {
//       addListener: () => { },
//       removeListener: () => { },
//     },
//     LatLngBounds: function () {
//       return {
//         extend: () => { },
//       };
//     }
//   }
// };

// (window as any).google = googleMock;

// // Find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);
// // And load the modules.
// context.keys().map(context);
