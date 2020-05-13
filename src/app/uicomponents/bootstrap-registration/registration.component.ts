import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ErrorUtilsService } from '../../service/util/error-utils.service';
import { Person } from '../../_models/person';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { WithValidation } from '../../_models/interfaces/with.validation';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CustomToastrService } from '../../service/util/custom-toastr.service';


@Component({
  selector: 'bootstrap-application-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, WithValidation {

  constructor(private apiService: ApiService,
              private toastrService: CustomToastrService,
              private translate: TranslateService,
              private router: Router,
              private errorUtils: ErrorUtilsService) {
  }

  // Allow only letters, at least one underscore
  public static userNamePattern = '^[a-z](?=.*[_]).*$';
  // Password should be at least 8 characters long and should contain one number,one character and one special character.
  public static passwordPattern = '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&_])[A-Za-z\\d$@$!%*#?&_]{8,}$';

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
    this.addUsernameAvailabilityCheck();
  }

  addValidation(): void {
    this.formValidation = {
      userName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20),
                                     Validators.pattern(RegistrationComponent.userNamePattern)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [this.checkPasswordsEqualsPass.bind(this), Validators.pattern(RegistrationComponent.passwordPattern)]),
      passwordRecap: new FormControl('', this.checkPasswordsEqualsPassR.bind(this))
    };
  }

  hasError(key: string): boolean {
    const field = this.formValidation[key];

    return field.invalid && Object.keys(field.errors).length > 0 && field.dirty;
  }

  getErrorMessage(key: string, opts?: {patternType: string}): string {
    return this.errorUtils.extractErrorMessage(this.formValidation, key, opts);
  }

  getValidityClass(key: string): string {
    const field = this.formValidation[key];
    if (!field.dirty) {
      return '';
    }

    return this.hasError(key) ? 'is-invalid' : 'is-valid';
  }

  addUsernameAvailabilityCheck(): void {
    this.formValidation.userName.valueChanges.pipe(
      filter(value => (value && value.length >= 5)),
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe(value => {
      this.apiService.checkUsernameAvailability(this.formValidation.userName.value)
        .subscribe(response => {
          if (Object.keys(response)
            .some(key => key === 'Status' && response['Status'] === 'Error')) {
            this.formValidation.userName.setErrors({userNameInUse: this.formValidation.userName.value});
          }
        });
    }, error => {
      this.registrationInProgress = false;
    });
  }

  checkPasswordsEqualsPassR(control: AbstractControl): void {
    this.checkPasswordsEquals(control);
  }

  checkPasswordsEqualsPass(control: AbstractControl): void {
    this.checkPasswordsEquals(control);
  }

  checkPasswordsEquals(control: AbstractControl): void {
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

  isFormValid(): boolean {
    return Object.keys(this.formValidation)
      .every(key => {
        if (key === 'password' || key === 'passwordRecap') { // -_- UGLY
          return true;
        }

        return this.formValidation[key].valid;
      });
  }

  doRegistrationForPerson(): void {
    this.registrationInProgress = true;
    this.apiService.registerPerson(this.person).subscribe(resp => {
    const source = timer(1000);
    source.subscribe(value => {
        this.toastrService.info(this.translate.instant('email.confirm.message'), this.translate.instant('email.confirm.title'));
        this.registrationInProgress = false;
        this.router.navigate(['/login']).then(r => {});
      });
    });
  }

}
