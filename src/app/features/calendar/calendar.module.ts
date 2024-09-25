import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { calendarRoutes } from './calendar.routes';



@NgModule({
  declarations: [
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    CommonModule,
    RouterModule.forChild(calendarRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule, FullCalendarModule,
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }
