// AI confidence score for this refactoring: 92.13%
/* Importing necessary module's. */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { AppRoutingModule } from './app.routing';

import { AppSettings } from './app.settings';
import { AppComponent } from './app.component';

import { MsalModule, MsalInterceptor, MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, protectedResources } from 'src/assets/config/auth.config';
import { FilterService } from './features/sidebar/services/filter.service';
import { FoxtrotModule } from './features/foxtrot/foxtrot.module';
import { ThemeModule } from './theme/theme.module';
import { CalendarModule } from './features/calendar/calendar.module';
import { LoaderInterceptor } from './shared/Services/loader.interceptor';
import { PlaceholderModule } from './features/add-placeholder/placeholder.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgScrollbarModule,
        SharedModule,
        PipesModule,
        AppRoutingModule,
        CalendarModule,
        PlaceholderModule,
        ToastrModule.forRoot(),

        /*  Configuration for the MsalModule using MsalModule.forRoot to set up the PublicClientApplication with the given msalConfig. */
        MsalModule.forRoot(
            new PublicClientApplication(msalConfig),
            {
                // The routing guard configuration.
                interactionType: InteractionType.Redirect,
                authRequest: {
                    scopes: [
                        ...protectedResources.scopes,
                    ]
                }
            },
            {
                // MSAL interceptor configuration.
                // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
                interactionType: InteractionType.Redirect,
                protectedResourceMap: new Map([
                    [protectedResources.endpoint, protectedResources.scopes]
                ])
            }
        ),

        HttpClientModule,
        FoxtrotModule,
        ThemeModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppSettings,
        { provide: OverlayContainer, useClass: CustomOverlayContainer },

        /* Providing HTTP interceptors for MsalInterceptor and LoaderInterceptor to handle HTTP requests. */
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
        MsalGuard, // MsalGuard added as provider here
        FilterService
    ],
    bootstrap: [
        AppComponent,
        MsalRedirectComponent
    ]
})
export class AppModule { }

/* Issues:
1. Incorrect apostrophes used in comment
2. Inconsistent spacing and formatting 
3. Redundant multi property in HTTP_INTERCEPTORS
4. Unused imports or comments
5. No separation between modules in imports for readability
*/