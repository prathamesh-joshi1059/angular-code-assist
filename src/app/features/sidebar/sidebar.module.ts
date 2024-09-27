// AI confidence score for this refactoring: 70.41%
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

/*
- Improper import statements that may not follow the standard paths.
- Lack of strong typing or lack of interface/type definitions for component inputs/outputs.
- Potential missing Angular lifecycle hooks for components if needed.
- No provided metadata for components and no encapsulation settings mentioned.
*/