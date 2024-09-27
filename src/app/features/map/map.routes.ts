// AI confidence score for this refactoring: 61.38%
import { Routes } from "@angular/router";
import { MsalGuard } from "@azure/msal-angular";
import { MapViewComponent } from "./components/map-view/map-view.component";


export const mapRoutes: Routes = [
    { path: "", component: MapViewComponent, canActivate: [MsalGuard] },
];

/*
- Missing type annotations on 'mapRoutes'.
- Improper use of single quotes for string literals; prefer double quotes for consistency.
- Lack of a trailing comma in the objects or arrays for easier version control diffs in future additions.
*/