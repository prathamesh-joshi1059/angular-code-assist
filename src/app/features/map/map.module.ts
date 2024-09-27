// AI confidence score for this refactoring: 83.23%
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from './components/map-view/map-view.component';
import { RouterModule } from '@angular/router';
import { mapRoutes } from './map.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotesDialogComponent } from './components/notes-dialog/notes-dialog.component';

@NgModule({
  declarations: [
    MapViewComponent,
    NotesDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(mapRoutes),
    SharedModule
  ]
})
export class MapModule { }

// Issues that violate TypeScript coding standards:
// - No explicit access modifiers for class properties
// - Missing return types for functions
// - Inconsistent use of single vs double quotes
// - No trailing commas in object literals