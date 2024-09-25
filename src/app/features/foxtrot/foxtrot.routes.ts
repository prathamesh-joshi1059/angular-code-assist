import { Routes } from "@angular/router";
import { FoxtrotWrapperComponent } from "./components/foxtrot-wrapper/foxtrot-wrapper.component";
import { MsalGuard } from "@azure/msal-angular";
import { AuthGuard } from "src/app/Guards/auth.guard";

export const foxtrotRoutes: Routes = [
    {
        path: "",
        component: FoxtrotWrapperComponent,
        canActivate: [MsalGuard],
        children: [
            {
                path: "calendar",
                canActivate: [AuthGuard],
                loadChildren: () => import("../calendar/calendar.module").then(m => m.CalendarModule)
            },
            {
                path: "map",
                canActivate: [AuthGuard],
                loadChildren: () => import("../map/map.module").then(m => m.MapModule)
            },
        ]
    }

]