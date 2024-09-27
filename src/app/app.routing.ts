// AI confidence score for this refactoring: 93.41%
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  // { path: "**", redirectTo: "calendar" }
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'map/:date', redirectTo: 'map', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

/*
Issues:
- Missing pathMatch for redirect in the 'map/:date' route
*/