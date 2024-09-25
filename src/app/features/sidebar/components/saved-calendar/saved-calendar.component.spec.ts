import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedCalendarComponent } from './saved-calendar.component';
import { OrderService } from 'src/app/shared/Services/order.service';
import { ToggleService } from 'src/app/features/add-placeholder/services/toggle.service';
import { SidenavService } from 'src/app/theme/services/sidenav.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/app/shared/Services/user.service';
import { MsalService } from '@azure/msal-angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CustomView } from 'src/app/models/custom-view';
import { ToastrService } from 'ngx-toastr';
import { CalendarControlService } from 'src/app/features/calendar/services/calendar-control.service';
import { AddCalendarService } from '../../services/add-calendar.service';

fdescribe('SavedCalendarComponent', () => {
  let component: SavedCalendarComponent;
  let fixture: ComponentFixture<SavedCalendarComponent>;
  let deb: DebugElement;
  let toggleServiceSpy: ToggleService;
  let sidenavService: SidenavService;
  let orderService: OrderService;

  let calendarControlService: CalendarControlService;

  beforeEach(async () => {
    const msalServiceSpyObj = jasmine.createSpyObj('MsalService', [
      'method1',
      'method2',
    ]);
    const toastrServiceSpyObj = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'info',
    ]);

    await TestBed.configureTestingModule({
      declarations: [SavedCalendarComponent],
      providers: [
        OrderService,
        ToggleService,
        SidenavService,
        CalendarControlService,
        AddCalendarService,
        UserService,
        { provide: MsalService, useValue: msalServiceSpyObj },
        { provide: ToastrService, useValue: toastrServiceSpyObj },
      ],
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedCalendarComponent);
    deb = fixture.debugElement;
    sidenavService = TestBed.inject(SidenavService);
    toggleServiceSpy = TestBed.inject(ToggleService);
    orderService = TestBed.inject(OrderService);
    calendarControlService = TestBed.inject(CalendarControlService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should open AddNewCalendar component', () => {
    spyOn(sidenavService, 'updateCalToggle');
    let addBtn = deb.query(By.css('#addBtn'));
    addBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(sidenavService.updateCalToggle).toHaveBeenCalledWith(true);
  });

  it('it should open Placeholder component', () => {
    spyOn(toggleServiceSpy, 'openDrawer');
    let addPlaceholderBtn = deb.query(By.css('#placeholderBtn'));
    addPlaceholderBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(toggleServiceSpy.openDrawer).toHaveBeenCalled();
  });

  it('should update the selected view and toggle values', () => {
    spyOn(sidenavService, 'updateCalToggle');
    const testView: CustomView = {
      calendarName: 'Test View',
      isDefault: true,
      isFavorite: false,
      branches: ['Branch 1', 'Branch 2'],
    };

    component.onSelectionChange(testView);

    expect(sidenavService.updateCalToggle).toHaveBeenCalledWith(false);
    expect(component.selectedView).toEqual(testView);
    expect(component.isPinFilled).toBeTrue();
    expect(component.isFavorite).toBeFalse();
  });

  it('should remove a branch from selectedView', () => {
    component.selectedView = {
      calendarName: 'Test View',
      isDefault: true,
      isFavorite: false,
      branches: ['Branch 1', 'Branch 2'],
    };
    const branchToRemove = 'Branch 1';
    component.removeBranch(branchToRemove);
    expect(component.selectedView.branches).toEqual(['Branch 2']);
  });

  it('should initialize customViews, selectedView, calendarName, isPinFilled and sortCustomViews on ngOnInit', () => {
    const mockCustomViews = [
      {
        calendarName: 'View 1',
        isDefault: true,
        isFavorite: false,
        branches: ['MEL'],
      },
      {
        calendarName: 'View 2',
        isDefault: false,
        isFavorite: true,
        branches: [],
      },
    ];

    orderService.calList$.subscribe(() => {
      return mockCustomViews;
    });
    sidenavService.addNewCalToggle$.subscribe(() => {
      return true;
    });

    calendarControlService.currentMonth$.subscribe(() => {
      return '2024-06';
    });

    component.ngOnInit();

    expect(component.customViews).toEqual(mockCustomViews);
    expect(component.selectedView).toEqual(mockCustomViews[0]);
    expect(component.calendarName).toBe('View 1');
    expect(component.isPinFilled).toBe(true);
    expect(component.currentMonth).toBe('2024-06');
    expect(component.addNewCalendarToggle).toBe(true);
  });

  it('should sort customViews array based on isFavorite property', () => {
    const mockCustomViews: CustomView[] = [
      {
        calendarName: 'View 1',
        isDefault: true,
        isFavorite: true,
        branches: [],
      },
      {
        calendarName: 'View 2',
        isDefault: false,
        isFavorite: false,
        branches: [],
      },
      {
        calendarName: 'View 3',
        isDefault: false,
        isFavorite: true,
        branches: [],
      },
    ];

    component.customViews = mockCustomViews;
    component.sortCustomViews();

    expect(component.customViews[0].calendarName).toBe('View 1');
    expect(component.customViews[1].calendarName).toBe('View 3');
    expect(component.customViews[2].calendarName).toBe('View 2');
  });

  it('should remove a branch from selectedView if branch exists', () => {
    component.selectedView = {
      calendarName: 'Test View',
      isDefault: true,
      isFavorite: false,
      branches: ['MEL', 'RIV', 'OBR'],
    };

    const branchToRemove = 'RIV';
    component.removeBranch(branchToRemove);

    expect(component.selectedView.branches).toEqual(['MEL', 'OBR']);
  });

  it('should not remove a branch if it does not exist in selectedView', () => {
    component.selectedView = {
      calendarName: 'Test View',
      isDefault: true,
      isFavorite: false,
      branches: ['Branch 1', 'Branch 2', 'Branch 3'],
    };

    const branchToRemove = 'Branch 4';
    component.removeBranch(branchToRemove);

    expect(component.selectedView.branches).toEqual([
      'Branch 1',
      'Branch 2',
      'Branch 3',
    ]);
  });

  //onSelectionChange()
  it('should update properties and call getViewOrders on selection change', () => {
    const customView: CustomView = {
      calendarName: 'Test View',
      isDefault: true,
      isFavorite: false,
      branches: ['Branch 1', 'Branch 2'],
    };

    const yearMonth = '2024-06';
    component.currentMonth = yearMonth;

    component.onSelectionChange(customView);

    expect(component.selectedView).toEqual(customView);
    expect(component.calendarName).toEqual('Test View');
    expect(component.isPinFilled).toBe(true);
    expect(component.isFavorite).toBe(false);
  });
});
