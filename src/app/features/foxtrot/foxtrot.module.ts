import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoxtrotWrapperComponent } from './components/foxtrot-wrapper/foxtrot-wrapper.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ThemeModule } from 'src/app/theme/theme.module';
import { RouterModule } from '@angular/router';
import { foxtrotRoutes } from './foxtrot.routes';
import { PlaceholderModule } from '../add-placeholder/placeholder.module';


@NgModule({
  declarations: [
    FoxtrotWrapperComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ThemeModule,
    RouterModule.forChild(foxtrotRoutes),
    PlaceholderModule

  ]
})
export class FoxtrotModule { }
