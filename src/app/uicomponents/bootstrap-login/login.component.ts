import { Component, OnInit } from '@angular/core';
import { Person } from '../../_models/person';
import { FormControl, Validators } from '@angular/forms';
import { WithValidation } from '../../_models/interfaces/with.validation';
import { ErrorUtilsService } from '../../service/util/error-utils.service';
import { ApiService } from '../../api/api.service';
import { ContextService } from '../../service/context/context.service';
import {AuthenticationState, AuthenticationStateService} from '../../service/subjects/authentication-state.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'application-bootstrap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, WithValidation {

  constructor(private apiService: ApiService,
              private authState: AuthenticationStateService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService,
              private errorUtils: ErrorUtilsService,
              private context: ContextService) { }

  person = new Person();

  formValidation: {
    userName: FormControl;
    password: FormControl;
  };

  ngOnInit(): void {
    this.addValidation();
  }

  addValidation(): void {
    this.formValidation = {
      userName: new FormControl('', [Validators.required]),
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
      this.toastr.success('', this.translate.instant('login.successful'));
      this.authState.setState(new AuthenticationState(true, response.body, this.generateAccessToken(response)));
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
