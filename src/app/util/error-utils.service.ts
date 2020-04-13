import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class ErrorUtilsService {

  constructor(private translate:  TranslateService) { }

  extractErrorMessage(src: any, key: string): string {
    if (src[key].hasError('required')) {
      return this.translate.instant('error.required');
    } if (src[key].hasError('minlength')) {
      return this.translate.instant('error.minlength');
    } if (src[key].hasError('maxlength')) {
      return this.translate.instant('error.maxlength');
    } if (src[key].hasError('email')) {
      return this.translate.instant('error.email');
    } if (src[key].hasError('pattern')) {
      return this.translate.instant('error.pattern');
    }
  }

}
