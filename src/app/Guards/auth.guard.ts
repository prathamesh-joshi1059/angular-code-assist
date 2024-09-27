// AI confidence score for this refactoring: 86.43%
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

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

// Issues: 
// 1. The class AuthGuard is missing 'implements CanActivate'.
// 2. There's no explicit return type in the canActivate method.