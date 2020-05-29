import { Component, OnInit } from '@angular/core';
import { Person } from '../../_models/person';
import { FormControl, Validators } from '@angular/forms';
import { WithValidation } from '../../_models/interfaces/with.validation';
import { ErrorUtilsService } from '../../service/util/error-utils.service';
import { ApiService } from '../../api/api.service';
import { ContextService } from '../../service/context/context.service';
import { AuthenticationState, AuthenticationStateService } from '../../system/authentication-state.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegistrationComponent } from '../bootstrap-registration/registration.component';
import { CustomToastrService } from '../../service/util/custom-toastr.service';
import { filter } from 'rxjs/operators';
import { RouteParamsReserved } from '../../service/const/route-params-reserved.enum';

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
              private toastrService: CustomToastrService,
              private translate: TranslateService,
              private errorUtils: ErrorUtilsService,
              private context: ContextService) {
    this.listenForEmailConfirmationToken();
  }

  person = new Person();

  formValidation: {
    userName: FormControl;
    password: FormControl;
  };

  private listenForEmailConfirmationToken(): void {
    const EMAIL_CONFIRM_PARAM = this.activatedRoute.queryParams.pipe(filter(params => params[RouteParamsReserved.RESERVED_URL_PARAM_EMAIL_CONFIRMATION]));

    EMAIL_CONFIRM_PARAM.subscribe((params: Params)  => {
      this.apiService.confirmEmail(params[RouteParamsReserved.RESERVED_URL_PARAM_EMAIL_CONFIRMATION]).subscribe(response => {
        const username = response.data['username'];
        if (username) {
          this.person.userName = username;
        }
        this.toastrService.success(this.translate.instant('email.confirmation.success.msg'), this.translate.instant('email.confirmation.success.title'));
      });
    });
  }

  ngOnInit(): void {
    this.addValidation();
  }

  addValidation(): void {
    this.formValidation = {
      userName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20),
                                     Validators.pattern(RegistrationComponent.userNamePattern)]),
      password: new FormControl('', [Validators.required, Validators.pattern(RegistrationComponent.passwordPattern)])
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

  getErrorMessage(key: string, opts?: {patternType: string}): string {
    return this.errorUtils.extractErrorMessage(this.formValidation, key, opts);
  }

  isFormValid(): boolean {
    return Object.keys(this.formValidation)
      .every(key => this.formValidation[key].valid);
  }

  onSubmit(): void {
    this.apiService.loginPerson(this.person).subscribe(response => {
      let token = this.getAccessToken(response.headers.get(ContextService.JWT_HEADER_NAME));
      let person = response.body;
      this.authenticate(token, person);
    });
  }

  public authenticate(token: string, person?: Person): void {
    if (person) {
      this.authState.setState(new AuthenticationState(true, person, token, {}));
      this.showWelcomeMessage(person);
      return;
    }

    // 1. Correct behavioral is:
    // Add Promise to getting application settings method which is currently running in background
    // Execute api call below after
    // TODO Add correct behavioral
    // 2. mega hack below: --//(-_-)\\ //(-_-)\\ //(-_-)\\
    this.context.setApplicationSettings({authenticationType: 'jwt'});
    // Save access token to context
    this.context.setAccessToken(token);
    this.apiService.getCurrentPerson().subscribe(person =>  {
      console.log(`External Authentication with token: ${token}. User: ${person.userName}`);
      this.authenticate(token, person);
    });
  }

  public getAccessToken(token: string): string {
    return token ? token : window.btoa(`${this.person.userName}:${this.person.password}`);
  }

  private showWelcomeMessage(person: Person): void {
    this.toastrService.success(this.translate.instant('login.successful'), `Hi, ${person.firstName}`);
  }
}
