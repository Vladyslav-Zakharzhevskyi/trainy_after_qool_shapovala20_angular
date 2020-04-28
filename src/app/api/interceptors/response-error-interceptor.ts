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
    enableHtml: true,
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
    const errorCase = this.getErrorCase(err);

    switch (errorCase) {
      case '0':
        this.toasterService.error(`Can't get access to endpoint due using self-written certificate.
        Make sure you go to AWS Beanstalk and either click allow to Trust this web-site or disable antivirus checking.
        <a class="btn btn-primary" href='${err.url}' target="_blank">Open AWS</a>.`,
          `Https Certificate Error`, this.config);
        break;
      case '1':
        this.toasterService.error(`${err.error.description}`, `${err.error.title} - Status: (${err.error.status})`, this.config);
        break;
      case '2':
        this.toasterService.error(`url: ${err.url}`, `${err.error.error} - Status: (${err.error.status})`, this.config);
        break;
      default:
        this.toasterService.error('An error occurred!', '', this.config);
    }
  }

  public getErrorCase(err: HttpErrorResponse): string {
    if (err.status === 0 && err.statusText === 'Unknown Error') {
      return '0';
    } else if (err.error.hasOwnProperty('title') && err.error.hasOwnProperty('description') && err.error.hasOwnProperty('status')) {
      return '1';
    }

    return '2';
  }
}
