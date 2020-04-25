import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ResponseErrorInterceptor implements HttpInterceptor {

  constructor(public toasterService: ToastrService) {}

  private config: object = {
    timeOut: 10000,
    extendedTimeOut: 5000,
    tapToDismiss: false,
    closeButton: true,
  };

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            try {
              this.toasterService.error(
                // tslint:disable-next-line:prefer-template
                'Message: ' + err.error.message, 'Status: (' + err.error.status + ') ' + err.error.error, this.config);
            } catch (e) {
              this.toasterService.error(
                'An error occurred!', '', this.config);
            }
          }

          return of(err);
        }));
  }
}
