import {Component, OnInit} from '@angular/core';
import {Person} from "../../_models/person";
import {FormControl, Validators} from "@angular/forms";
import {ErrorUtilsService} from "../../util/error-utils.service";
import {ApiService} from "../../api/api.service";
import {SnackBarService} from "../../service/custom/snack-bar.service";
import {Router} from "@angular/router";
import {ContextService} from "../../service/context/context.service";
import {AuthenticationStateService} from "../../service/subjects/authentication-state.service";

@Component({
  selector: 'application-login',
  templateUrl: './login-form.component.html',
  styleUrls: ['../register/registration-form.component.css']
})
export class LoginFormComponent implements OnInit {

  person = new Person();

  formValidation = {
    userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required])
  };

  constructor(private errorUtilsService: ErrorUtilsService,
              private apiService: ApiService,
              private authState: AuthenticationStateService,
              protected snackBarService: SnackBarService,
              private router: Router,
              private context: ContextService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.formValidation.password.invalid && this.formValidation.userName.invalid) {
      return;
    }
    this.apiService.loginPerson(this.person).subscribe(
      response => {
        this.context.setAccessToken(this.person, response);
        this.snackBarService.showSnackBar("Successful login!", "success", 4000);
        this.getCurrentLoggedInUser();
      },
      error => {
        this.snackBarService.showSnackBar("Login has been failed!", "error", 4000);
      }
    );
  }

  getCurrentLoggedInUser(): void {
    this.apiService.getCurrentPerson().subscribe(person => {
        this.context.authenticate(person);
        this.authState.setState(true);
        this.router.navigate(['/applications'])
      }
    );
  }

  getErrorMessage(key: string): string {
    return this.errorUtilsService.extractErrorMessage(this.formValidation, key);
  }
}
