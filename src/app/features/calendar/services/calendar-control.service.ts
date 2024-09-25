import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarControlService {
  constructor() {}

  private initialDate: string;

  /* Subject and Observable used to trigger a backward movement in the calendar. */
  public moveBackwardSubject = new Subject<void>();
  moveBackward$ = this.moveBackwardSubject.asObservable();
  /*  Method to move the calendar backward by emitting a next event in the moveBackwardSubject. */
  moveCalendarBackward() {
    this.moveBackwardSubject.next();
  }

  /* Subject and Observable used to trigger a forward movement in the calendar. */
  public moveForwardSubject = new Subject<void>();
  moveForward$ = this.moveForwardSubject.asObservable();
  /*  Method to move the calendar forward by emitting a next event in the moveBackwardSubject. */
  moveCalendarForward() {
    this.moveForwardSubject.next();
  }

  /* Subject and Observable used to update the current month in the calendar. */
  public currentMonthSubject = new Subject<string>();
  currentMonth$ = this.currentMonthSubject.asObservable();
  /* Method to update the current month by emitting a next event with the new month value.*/
  updateCurrentMonth(month: string) {
    this.currentMonthSubject.next(month);
  }

  /* Function to extract the selected month from a Date object and update the current month.*/
  selectedMonth(day: Date) {
    const month = day.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
      day: '2-digit',
    });

    this.updateCurrentMonth(month);
  }

  /* Function to set the initial date value. */
  setInitialDate(date: string) {
    this.initialDate = date;
  }

  /* Function to get the initial date value. */
  getInitialDate(): string {
    return this.initialDate;
  }



}
