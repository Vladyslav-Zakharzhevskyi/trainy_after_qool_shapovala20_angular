import { Component, OnInit } from '@angular/core';
import { Person } from '../../_models/person';
import { FormControl, Validators } from '@angular/forms';
import { WithValidation } from '../../_models/interfaces/with.validation';
import { ErrorUtilsService } from '../../service/util/error-utils.service';
import { ApiService } from '../../api/api.service';
import { ContextService } from '../../service/context/context.service';
import { AuthenticationState, AuthenticationStateService } from '../../system/authentication-state.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'application-bootstrap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, WithValidation {

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService,
              private authState: AuthenticationStateService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService,
              private errorUtils: ErrorUtilsService,
              private context: ContextService) {
    this.confirmEmail();
  }

  person = new Person();

  formValidation: {
    userName: FormControl;
    password: FormControl;
  };

  private confirmEmail(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      // Do call to Confirm email
      const token = params['token'];
      if (token) {
        this.apiService.confirmEmail(token).subscribe(response => {
          const username = response.data['username'];
          if (username) {
            this.person.username = username;
          }
          this.toastr.success(this.translate.instant('email.confirmation.success.msg'), this.translate.instant('email.confirmation.success.title'));
        });
      }
    });
  }

  ngOnInit(): void {
    this.addValidation();
  }

  addValidation(): void {
    this.formValidation = {
      userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required])
    };
  }

  hasError(key: string): boolean {
    const field = this.formValidation[key];

    return field.invalid && Object.keys(field.errors).length > 0 && field.dirty;
  }

  getValidityClass(key: string): string {
    const field = this.formValidation[key];
    if (!field.dirty) {
      return '';
    }

    return this.hasError(key) ? 'is-invalid' : 'is-valid';
  }

  getErrorMessage(key: string): string {
    return this.errorUtils.extractErrorMessage(this.formValidation, key);
  }

  isFormValid(): boolean {
    return Object.keys(this.formValidation)
      .every(key => this.formValidation[key].valid);
  }

  onSubmit(): void {
    this.apiService.loginPerson(this.person).subscribe(response => {
      const authPerson = response.body;
      this.toastr.success(this.translate.instant('login.successful'), `Hi, ${authPerson.firstName}`);
      this.authState.setState(new AuthenticationState(true, authPerson, this.generateAccessToken(response), {}));
    });
  }

  private generateAccessToken(response: any): string {
    const jwtToken = response.headers.get(ContextService.JWT_HEADER_NAME);
    if (jwtToken) {
      return jwtToken;
    }

    return window.btoa(`${this.person.username}:${this.person.password}`);
  }
}
