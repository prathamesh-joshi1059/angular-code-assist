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

  constructor(private user: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requestsPending.next(this.requestsPending.value + 1);
    this.user.setLoader(true); // API call started

    return next.handle(request).pipe(
      finalize(() => {
        this.requestsPending.next(this.requestsPending.value - 1);
        if (this.requestsPending.value === 0) {
          this.user.setLoader(false); // All API calls finished
        }
      })
    );
  }
}

