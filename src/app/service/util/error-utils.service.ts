import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorUtilsService {

  constructor(private translate: TranslateService) { }

  extractErrorMessage(src: any, key: string): string {
    if (src[key].hasError('required')) {
      return this.translate.instant('error.required');
    } else if (src[key].hasError('minlength')) {
      return this.translate.instant('error.minlength');
    } else if (src[key].hasError('maxlength')) {
      return this.translate.instant('error.maxlength');
    } else if (src[key].hasError('email')) {
      return this.translate.instant('error.email');
    } else if (src[key].hasError('pattern')) {
      return this.translate.instant('error.pattern');
    } else if (src[key].hasError('userNameInUse')) {
      return this.translate.instant('error.username.duplicate');
    } else if (src[key].hasError('passMissMatch')) {
      return this.translate.instant('error.passwords.miss.match');
    }
  }

}
