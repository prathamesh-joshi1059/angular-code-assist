// AI confidence score for this refactoring: 61.33%
import { Routes } from "@angular/router";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { MsalGuard } from "@azure/msal-angular";

export const calendarRoutes: Routes = [
    { path: "", component: CalendarComponent, canActivate: [MsalGuard] },
];

// Issues:
// 1. Incorrect casing for the import path of 'AuthGuard' (it should be consistent with the file structure).
// 2. MsalGuard should be imported from a consistently maintained module path.
// 3. Route paths should ideally be prefixed with a meaningful string to avoid conflicts in larger applications.