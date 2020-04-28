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
    progressBar: true
  };

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            try {
              console.log(err);
              this.showError(err);
            } catch (e) {
              this.toasterService.error('An error occurred!', '', this.config);
            }
          }

          return of(err);
        }));
  }

  private showError(err: HttpErrorResponse): void {
    if (err.error.hasOwnProperty('title') && err.error.hasOwnProperty('description') && err.error.hasOwnProperty('status')) {
      this.toasterService.error(`${err.error.description}`, `${err.error.title} - Status: (${err.error.status})`, this.config);
    } else {
      this.toasterService.error(`url: ${err.url}`, `${err.error.error} - Status: (${err.error.status})`, this.config);
    }
  }

}
