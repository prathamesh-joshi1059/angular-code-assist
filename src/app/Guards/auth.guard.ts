import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private msalService: MsalService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.msalService.instance.getAllAccounts().length > 0) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect to login if not authenticated
      return false;
    }
  }
}
