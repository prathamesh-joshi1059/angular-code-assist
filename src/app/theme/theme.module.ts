// AI confidence score for this refactoring: 82.24%
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from '../features/sidebar/sidebar.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SidenavComponent],
  imports: [CommonModule, SidebarModule, SharedModule],
  exports: [SidenavComponent, SidebarModule]
})
export class ThemeModule { }

// Issues: 
// - No access modifiers are used for the class members.
// - There is inconsistent formatting in the imports array.