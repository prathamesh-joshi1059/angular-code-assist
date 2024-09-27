// AI confidence score for this refactoring: 89.67%
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { calendarRoutes } from './calendar.routes';

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule.forChild(calendarRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }

/*
- Duplicate import of CommonModule
- Duplicate import of FullCalendarModule
- Unused imports or declarations can be cleaned up
*/