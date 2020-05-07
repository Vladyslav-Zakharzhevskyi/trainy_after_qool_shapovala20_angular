import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorUtilsService {

  constructor(private translate: TranslateService) { }

  extractErrorMessage(src: any, key: string, opts?: {patternType: string}): string {
    const formControl: FormControl = src[key];

    if (formControl.hasError('required')) {
      return this.translate.instant('error.required');
    } else if (formControl.hasError('minlength')) {
      return this.translate.instant('error.minlength', {minLength: formControl.getError('minlength').requiredLength});
    } else if (formControl.hasError('maxlength')) {
      return this.translate.instant('error.maxlength', {maxLength: formControl.getError('maxlength').requiredLength});
    } else if (formControl.hasError('email')) {
      return this.translate.instant('error.email');
    } else if (formControl.hasError('pattern')) {
      if (opts && opts.patternType) {
        return this.returnPatternErrorMsgByType(opts.patternType);
      }
      return this.translate.instant('error.pattern');
    } else if (formControl.hasError('userNameInUse')) {
      return this.translate.instant('error.username.duplicate');
    } else if (formControl.hasError('passMissMatch')) {
      return this.translate.instant('error.passwords.miss.match');
    }
  }

  returnPatternErrorMsgByType(type: string): string {
    switch (type) {
      case 'username':
        return this.translate.instant('error.pattern.username');
        case 'pass':
        return this.translate.instant('error.pattern.password');
      default:
        return this.translate.instant('error.pattern');
    }
  }

}
