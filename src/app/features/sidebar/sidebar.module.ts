import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './components/filters/filters.component';
import { AddNewCalendarComponent } from './components/add-new-calendar/add-new-calendar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SavedCalendarComponent } from './components/saved-calendar/saved-calendar.component';


@NgModule({
  declarations: [
    FiltersComponent,
    AddNewCalendarComponent,
    SavedCalendarComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AddNewCalendarComponent,
    FiltersComponent,
    SavedCalendarComponent
  ]
})
export class SidebarModule { }
