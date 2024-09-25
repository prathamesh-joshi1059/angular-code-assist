import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  // { path: "**", redirectTo: "calendar" }
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'map/:date', redirectTo: 'map' },

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
