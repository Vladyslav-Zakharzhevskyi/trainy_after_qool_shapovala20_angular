import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {ApiService} from '../../api/api.service';
import {ErrorUtilsService} from '../../service/util/error-utils.service';
import {Person} from '../../_models/person';
import {Router} from '@angular/router';
import {timer} from 'rxjs';


@Component({
  selector: 'bootstrap-application-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private apiService: ApiService,
              private router: Router,
              private errorUtils: ErrorUtilsService) {
  }

  person: Person = new Person();

  registrationInProgress = false;

  formValidation: {
    userName: FormControl;
    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    password: FormControl;
    passwordRecap: FormControl;
  };

  ngOnInit(): void {
    this.addValidation();
  }

  private addValidation() {
    this.formValidation = {
      userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20),
        this.checkUserNameAvailability.bind(this)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [this.checkPasswordsEqualsPass.bind(this)]),
      passwordRecap: new FormControl('', [this.checkPasswordsEqualsPassR.bind(this), Validators.required])
    };
  }

  hasError(key: string): boolean {
    const field = this.formValidation[key];
    return field.invalid && Object.keys(field.errors).length > 0 && field.dirty;
  }

  getErrorMessage(key: string): string {
    return this.errorUtils.extractErrorMessage(this.formValidation, key);
  }

  getValidityClass(key: string) {
    const field = this.formValidation[key];
    if (!field.dirty) {
      return '';
    }
    return this.hasError(key) ? 'is-invalid' : 'is-valid';
  }

  checkUserNameAvailability(control: AbstractControl) {
    if (control.value) {
      this.apiService.checkUsernameAvailability(control.value).subscribe(response => {
        if (Object.keys(response).some(key => key === 'Status' && response['Status'] === 'Error')) {
          control.setErrors({userNameInUse: control.value});
        }
      });
    }
  }

  checkPasswordsEqualsPassR(control: AbstractControl) {
    this.checkPasswordsEquals(control);
  }

  checkPasswordsEqualsPass(control: AbstractControl) {
    this.checkPasswordsEquals(control);
  }

  checkPasswordsEquals(control: AbstractControl) {
    if (this.formValidation && control.value) {
      if (this.formValidation.password.value !== this.formValidation.passwordRecap.value &&
        (this.formValidation.password.value && this.formValidation.passwordRecap.value)) {
        this.formValidation.password.setErrors({passMissMatch: true});
        this.formValidation.passwordRecap.setErrors({passMissMatch: true});
      } else {
        this.formValidation.password.setErrors({});
        this.formValidation.passwordRecap.setErrors({});
      }
    }
  }

  isFormValid() {
    return Object.keys(this.formValidation)
      .every(key => {
        if (key === 'password' || key === 'passwordRecap') { /* -_- UGLY */
          return true;
        } else {
          return this.formValidation[key].valid;
        }
      });
  }

  doRegistrationForPerson(): void {
    this.registrationInProgress = true;
    this.apiService.registerPerson(this.person).subscribe(resp => {
      const source = timer(1000);
      source.subscribe(value => {
        this.registrationInProgress = false;
        this.router.navigate(['/login']).then(r => {
        });
      });
    });
  }

}
