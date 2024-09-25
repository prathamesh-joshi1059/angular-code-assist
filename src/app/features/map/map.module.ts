import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from './components/map-view/map-view.component';
import { Router, RouterModule } from '@angular/router';
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
