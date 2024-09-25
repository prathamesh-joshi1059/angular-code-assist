import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { UserService } from './shared/Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  public settings: Settings;
  title = 'foxtrot_web_app';

  isIframe: boolean = false;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    public appSettings: AppSettings,
    private broadcastService: MsalBroadcastService,
    private msalService: MsalService,
    private user: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.settings = this.appSettings.settings;
  }
  /* // Initializes the component. */
  ngOnInit() {
    /* Checks if the current window is embedded in an iframe by comparing the window object with its parent and opener. */
    this.isIframe = window !== window.parent && !window.opener;

    /* Subscribe to the inProgress$ stream and handle the user login process. */
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        if (this.msalService.instance.getAllAccounts().length === 0) {
          this.login();
        }

        const user = this.msalService.instance.getAllAccounts()[0]?.username;
        this.user.setLoggedUser = this.msalService.instance.getAllAccounts()[0];
      });
  }

  /*  Subscribes to the loader observable to update the loader status in the component after the view has been initialized. */
  loader = false;
  ngAfterViewInit() {
    this.user.loader.subscribe((result) => {
      this.loader = result;
      this.cdr.detectChanges();
    });
  }

  /* Initiates the login process using msalService's loginRedirect method and subscribes to the response handling the success and error scenarios. */
  login() {
    this.msalService.loginRedirect().subscribe({
      next: (response) => {
        console.log(this.msalService.instance.getAllAccounts()[0].username);
        console.log(response);
      },
      error: (error) => {
        console.error('Login error:', error);
      },
    });
  }

  /*  Unsubscribes and completes the destroying$ subject to clean up resources when the component is destroyed. */
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
