import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCalendarComponent } from './add-new-calendar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from 'src/app/shared/Services/user.service';
import { AddCalendarService } from '../../services/add-calendar.service';
import { SidenavService } from 'src/app/theme/services/sidenav.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MsalService } from '@azure/msal-angular';

describe('AddNewCalendarComponent', () => {
  let component: AddNewCalendarComponent;
  let fixture: ComponentFixture<AddNewCalendarComponent>;
  let MsalServiceSpy: jasmine.SpyObj<MsalService>;
  let addCalendarServiceSpy: AddCalendarService;
  let sidenavServiceSpy: SidenavService;
  let deb: DebugElement;

  beforeEach(async () => {
    const MsalServiceSpyObj = jasmine.createSpyObj('MsalService', ['method1', 'method2']);

    await TestBed.configureTestingModule({
      declarations: [AddNewCalendarComponent],
      providers: [{ provide: MsalService, useValue: MsalServiceSpyObj }, AddCalendarService, SidenavService],
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule],
    }).compileComponents();

    MsalServiceSpy = TestBed.inject(MsalService) as jasmine.SpyObj<MsalService>;

    addCalendarServiceSpy = TestBed.inject(AddCalendarService);
    sidenavServiceSpy = TestBed.inject(SidenavService);
    fixture = TestBed.createComponent(AddNewCalendarComponent);
    deb = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define all required variables except [isFirstLogin]', () => {
    expect(component.isStarFilled).toBeDefined();
    expect(component.isPinFilled).toBeDefined();
    expect(component.Regions).toBeDefined();
    expect(component.Areas).toBeDefined();
    expect(component.Branches).toBeDefined();
  });

  it('should subscribe to getBranches, getFilteredBranches, getFilteredBranches', () => {
    spyOn(addCalendarServiceSpy, 'getBranches').and.returnValue(of(['Region1', 'Region2']));
    spyOn(addCalendarServiceSpy, 'getFilteredAreas').and.returnValue(of([{ area: 'Area1', branchId: 'Id1', branchName: 'Branch1', regionName: 'Region1' }, { area: 'Area2', branchId: 'Id2', branchName: 'Branch2', regionName: 'Region2' }]));
    spyOn(addCalendarServiceSpy, 'getFilteredBranches').and.returnValue(of([{ area: 'Area1', branchId: 'Id1', branchName: 'Branch1', regionName: 'Region1' }, { area: 'Area2', branchId: 'Id2', branchName: 'Branch2', regionName: 'Region2' }]));
    component.sidenavService.firstLogin$ = of(true);
    component.ngOnInit();
    expect(addCalendarServiceSpy.getBranches).toHaveBeenCalled();
    expect(addCalendarServiceSpy.getFilteredAreas).toHaveBeenCalled();
    expect(addCalendarServiceSpy.getFilteredBranches).toHaveBeenCalled();
    expect(component.isFirstLogin).toBeTrue();

    expect(component.Regions).toEqual(['Region1', 'Region2']);
    expect(component.Areas).toEqual(['Area1', 'Area2']);
    expect(component.Branches).toEqual([{ area: 'Area1', branchId: 'Id1', branchName: 'Branch1', regionName: 'Region1' }, { area: 'Area2', branchId: 'Id2', branchName: 'Branch2', regionName: 'Region2' }]);
  });

  it('should initialize the form', () => {
    expect(component.addNewCalendarForm.value).toEqual({
      regions: null,
      areas: null,
      branches: null,
      calendarName: null,
    } as any);
  });

  it('should call filterArea on Region selection', () => {
    spyOn(addCalendarServiceSpy, 'filterArea');
    component.onRegionChange();
    expect(addCalendarServiceSpy.filterArea).toHaveBeenCalledWith((component.addNewCalendarForm?.controls.regions.value) ? component.addNewCalendarForm?.controls?.regions.value : [])
  });

  it('should call filterBranches on Area selection', () => {
    spyOn(addCalendarServiceSpy, 'filterBranches');
    component.onAreaChange();
    expect(addCalendarServiceSpy.filterBranches).toHaveBeenCalledWith((component.addNewCalendarForm?.controls.areas.value) ? component.addNewCalendarForm?.controls?.areas.value : [])
  });

  it('should close the form on close button click', () => {
    spyOn(sidenavServiceSpy, 'updateCalToggle');
    let closeBtn = deb.query(By.css('.button-style.cancel-button'))
    closeBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(sidenavServiceSpy.updateCalToggle).toHaveBeenCalledOnceWith(false);
  });

  it('should reset the form on component destroy', () => {
    component.ngOnDestroy();
    expect(component.addNewCalendarForm.value).toEqual({
      regions: null,
      areas: null,
      branches: null,
      calendarName: null,
    })
  });

  it('should save calendar if form is valid', () => {
    spyOn(addCalendarServiceSpy, 'createCalendar');
    let payload = {
      userId: 'john.doe@example.com',
      calendarName: "John's Calendar",
      regions: ['South'],
      areas: ['Florida'],
      branches: ['MEL'],
      isDefault: true,
      isFavorite: true
    }
    if (component.addNewCalendarForm.valid) {
      expect(addCalendarServiceSpy.createCalendar).toHaveBeenCalledWith(payload);
    } else {
      expect(addCalendarServiceSpy.createCalendar).not.toHaveBeenCalled();
    }
  })
});
