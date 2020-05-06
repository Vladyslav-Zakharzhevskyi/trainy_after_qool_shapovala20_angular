import { Injectable, Injector, NgModule } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ResponseErrorInterceptor implements HttpInterceptor {

  constructor(private injector: Injector,
              public toasterService: ToastrService) {}

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
    const status = err.error.status;

    switch (errorCase) {
      case '0':
        this.toasterService.error(
          `${this.getTranslate().instant('error.server.unavailable.msg', {url: err.url})}`,
          `${this.getTranslate().instant('error.server.unavailable.title')}`,
          this.config);
        break;
      case '1':
        if (status === 452 || status === 450) {
          this.showEmailTokenValidationError(status, err.error);
          return;
        }
        this.toasterService.error(`${err.error.description}`, `${err.error.title} - Status: (${status})`, this.config);
        break;
      case '3':
        // Authentication error
        this.showAuthenticationError(err.error.statusCode, err.error.authenticationError);
        break;
      case '000':
        this.toasterService.error(`url: ${err.url}`, `${err.error.error} - Status: (${err.error.status})`, this.config);
        break;
      default:
        this.showUnrecognizedErrorMsg();
    }
  }

  public getErrorCase(err: HttpErrorResponse): string {
    if (err.status === 0 && err.statusText === 'Unknown Error') {
      return '0';
    } else if (err.error.hasOwnProperty('title') && err.error.hasOwnProperty('description') && err.error.hasOwnProperty('status')) {
      return '1';
    } else if (err.error.hasOwnProperty('authenticationError') &&
              (err.error.statusCode === 321 || err.error.statusCode === 322 || err.error.statusCode === 455)) {
      return '3';
    }

    return '000';
  }

  showEmailTokenValidationError(status: number, err: any): void {
    switch (status) {
      case 450:
        this.toasterService.error(this.getTranslate().instant('error.email.token.not.found', {token: err.data.token}),
          `${this.getTranslate().instant('error.backend.title')}`, this.config);
        break;
      case 452:
        this.toasterService.error(this.getTranslate().instant('error.email.token.expired',
          {token: err.data.token, expiredDate: err.data.expiredDate}),
          `${this.getTranslate().instant('error.backend.title')}`, this.config);
        break;
      default:
        this.showUnrecognizedErrorMsg();
    }
  }

  showUnrecognizedErrorMsg(): void {
    this.toasterService.error('An error occurred!', '', this.config);
  }

  // Get translate service by injector
  private getTranslate(): TranslateService {
    return this.injector.get(TranslateService);
  }

  showAuthenticationError(status: number, err: any): void {
    switch (status) {
      case 321:
        this.toasterService.error(
          this.getTranslate().instant('error.login.username.not.found.msg'),
          this.getTranslate().instant('error.login.username.not.found.title'),
          this.config);
        break;
      case 322:
        this.toasterService.error(
          this.getTranslate().instant('error.login.wrong.password.msg'),
          this.getTranslate().instant('error.login.wrong.password.title'),
          this.config);
        break;
      case 455:
        this.toasterService.error(
          this.getTranslate().instant('error.email.not.confirmed.msg'),
          this.getTranslate().instant('error.email.not.confirmed.title'),
          this.config);
        break;
      default:
        this.showUnrecognizedErrorMsg();
    }
  }
}
