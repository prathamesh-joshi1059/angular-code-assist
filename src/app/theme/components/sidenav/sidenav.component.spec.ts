import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SidenavComponent } from "./sidenav.component";
import { DebugElement } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { ToastrService } from "ngx-toastr";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SidenavService } from "../../services/sidenav.service";
import { UserService } from "src/app/shared/Services/user.service";
import { CalendarControlService } from "src/app/features/calendar/services/calendar-control.service";
import { SavedCalendarService } from "src/app/features/sidebar/services/saved-calendar.service";
import { Router } from "@angular/router";

describe('SidenavCompoent',()=>{
    let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let deb: DebugElement;
  let userService: UserService;
  let sidenavService: SidenavService;
  let calendarService:CalendarControlService;
  let savedService:SavedCalendarService;
  let route:Router
  beforeEach(async () => {
    const msalServiceSpyObj = jasmine.createSpyObj('MsalService', ['method1', 'method2']);
    const toastrServiceSpyObj = jasmine.createSpyObj('ToastrService',['success','error', 'info']);
    
    await TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      providers: [SidenavService,UserService, CalendarControlService, SavedCalendarService,
         { provide: MsalService, useValue: msalServiceSpyObj },
        {provide: ToastrService, useValue: toastrServiceSpyObj}
      ],
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule]
    })
      .compileComponents();

      fixture = TestBed.createComponent(SidenavComponent);
      deb = fixture.debugElement;
      sidenavService = TestBed.inject(SidenavService);
     
      component = fixture.componentInstance;
      fixture.detectChanges();
})

it('should create', () => {
    expect(component).toBeTruthy();
  });


  //ngOnInit(())
    it('should initialize component properties in ngOnInit', () => {
        spyOn(userService, 'loggedUser').and.returnValue({ name: 'Test User', userEmail: 'test@example.com' });
        
        component.ngOnInit();
        
        expect(component.userName).toBe('Test User');
        expect(component.userMail).toBe('test@example.com');
      });

      it('should call moveCalendarBackward method on prevMonth', () => {
        spyOn(calendarService, 'moveCalendarBackward');
        
        component.prevMonth();
        
        expect(calendarService.moveCalendarBackward).toHaveBeenCalled();
      });

      it('should call moveCalendarBackward method on prevMonth', () => {
        spyOn(calendarService, 'moveCalendarForward');
        
        component.nextMonth();
        
        expect(calendarService.moveCalendarForward).toHaveBeenCalled();
      });

      //returnMonth()
      it('should set initial date and call getView on returnMonth', () => {
        spyOn(calendarService, 'setInitialDate');
        spyOn(savedService, 'getView');
        spyOn(route, 'navigate');
        
        component.returnMonth();
        
        expect(calendarService.setInitialDate).toHaveBeenCalled();
        expect(savedService.getView).toHaveBeenCalled();
        expect(route.navigate).toHaveBeenCalledWith(['calendar']);
      });

//ngOnDestroy()
      it('should unsubscribe from currentMonthSubscription in ngOnDestroy', () => {
        spyOn(component.currentMonthSubscription, 'unsubscribe');
        
        component.ngOnDestroy();
        
        expect(component.currentMonthSubscription.unsubscribe).toHaveBeenCalled();
      });
})