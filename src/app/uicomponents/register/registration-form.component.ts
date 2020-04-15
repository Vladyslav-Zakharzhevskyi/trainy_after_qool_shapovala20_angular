import {Component, OnInit} from '@angular/core';
import {Person} from "../../_models/person";
import {ApiService} from "../../api/api.service";
import {FormControl, Validators} from "@angular/forms";
import {ErrorUtilsService} from "../../service/util/error-utils.service";
import {SnackBarService} from "../../service/custom/snack-bar.service";
import {JoinComponent} from "../join/join.component";

@Component({
  selector: 'application-registration',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  formValidation = {
    userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  };

  person = new Person();


  constructor(private apiService: ApiService,
              private errorUtils: ErrorUtilsService,
              private snackBarService: SnackBarService,
              private joinComponent: JoinComponent) { }

  ngOnInit(): void {
  }

  doRegistrationForPerson(): void {
    this.apiService.registerPerson(this.person).subscribe(resp => {
      this.snackBarService.showSnackBar("You have registered successfully", "info", 4000);
      this.joinComponent.selectedTab(0);
    });
  }

  getErrorMessage(key: string): string {
    return this.errorUtils.extractErrorMessage(this.formValidation, key);
  }


}
