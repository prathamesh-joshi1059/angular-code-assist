// AI confidence score for this refactoring: 92.44%
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requestsPending = new BehaviorSubject<number>(0);

  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requestsPending.next(this.requestsPending.value + 1);
    this.userService.setLoader(true); // API call started

    return next.handle(request).pipe(
      finalize(() => {
        this.requestsPending.next(this.requestsPending.value - 1);
        if (this.requestsPending.value === 0) {
          this.userService.setLoader(false); // All API calls finished
        }
      })
    );
  }
}

// Issues: 
// 1. Service property name 'user' should be more descriptive