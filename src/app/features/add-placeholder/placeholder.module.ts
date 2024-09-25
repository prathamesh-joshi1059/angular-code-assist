import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPlaceholderComponent } from './add-placeholder.component';



@NgModule({
  declarations: [AddPlaceholderComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports:[AddPlaceholderComponent]
})
export class PlaceholderModule { }
