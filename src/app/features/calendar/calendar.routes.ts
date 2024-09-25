import { Routes } from "@angular/router";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { MsalGuard } from "@azure/msal-angular";
import { AuthGuard } from "src/app/Guards/auth.guard";


export const calendarRoutes: Routes = [
    { path: "", component: CalendarComponent, canActivate: [MsalGuard] },
];
