import { TestBed } from '@angular/core/testing';
import { CalendarControlService } from './calendar-control.service';

describe('CalendarControlService', () => {
  let service: CalendarControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarControlService]
    });
    service = TestBed.inject(CalendarControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get initial date', () => {
    const date = '2024-06-20';
    service.setInitialDate(date);
    expect(service.getInitialDate()).toEqual('2024-06-20');
  });

  it('should emit move backward event', () => {
    let emitted = false;
    service.moveBackward$.subscribe(() => {
      emitted = true;
    });
    service.moveCalendarBackward();
    expect(emitted).toBeTrue();
  });

  it('should emit move forward event', () => {
    let emitted = false;
    service.moveForward$.subscribe(() => {
      emitted = true;
    });

    service.moveCalendarForward();
    expect(emitted).toBeTrue();
  });


 it('should update current month', () => {
    const month = 'June 2024';
    let updatedMonth: string = '';
    service.currentMonth$.subscribe((value) => {
      updatedMonth = value;
    });
    service.updateCurrentMonth(month);
    expect(updatedMonth).toEqual(month);
});



it('should update current month with selected month', () => {
  const date = new Date('2024-06-15');
  const month = 'June 15, 2024';

  const selectSpy = spyOn(service, 'selectedMonth').and.callThrough();
  const updateSpy = spyOn(service, 'updateCurrentMonth').and.callThrough();

  service.selectedMonth(date);

  console.log('Calls to selectedMonth:', selectSpy.calls.allArgs());
  console.log('Calls to updateCurrentMonth:', updateSpy.calls.allArgs());

  expect(selectSpy).toHaveBeenCalledWith(date);
  expect(updateSpy).toHaveBeenCalledWith(month);
});




});