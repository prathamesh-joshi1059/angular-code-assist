import { Routes } from "@angular/router";
import { MsalGuard } from "@azure/msal-angular";
import { MapViewComponent } from "./components/map-view/map-view.component";


export const mapRoutes: Routes = [
    { path: "", component: MapViewComponent, canActivate: [MsalGuard] },
];
