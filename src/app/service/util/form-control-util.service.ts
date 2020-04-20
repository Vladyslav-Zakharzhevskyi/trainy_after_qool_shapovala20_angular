import { Injectable } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormControlUtilService {

  constructor() { }

  public generate(type: InputTypeValidation): FormControl {
    if (type === InputTypeValidation.REQUIRED) {
      return new FormControl('', [Validators.required]);
    } else if (type === InputTypeValidation.DEFAULT_EMAIL) {
      return new FormControl('', [Validators.required, Validators.email]);
    } else if (type === InputTypeValidation.DEFAULT_STRING_INPUT) {
      return new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
    } else if (type === InputTypeValidation.DEFAULT_DESCRIPTION) {
      return new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]);
    }
  }
}


export enum InputTypeValidation {
  REQUIRED,
  DEFAULT_STRING_INPUT,
  DEFAULT_EMAIL,
  DEFAULT_DESCRIPTION

}
