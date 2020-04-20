import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Person} from '../../_models/person';
import {ApiService} from '../../api/api.service';
import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {ErrorUtilsService} from '../../service/util/error-utils.service';
import {SnackBarService} from '../../service/custom/snack-bar.service';
import {JoinComponent} from '../join/join.component';
import {WithValidatorsInterface} from '../../_models/interfaces/with-validators.interface';

@Component({
  selector: 'application-registration',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit, WithValidatorsInterface {

  constructor(private apiService: ApiService,
              private errorUtils: ErrorUtilsService,
              private snackBarService: SnackBarService,
              private joinComponent: JoinComponent) { }

  @ViewChild('usernameInput')
  username: ElementRef;

  isUsernameAvailable = false;

  person = new Person();

  formValidation: {
    firstName: FormControl;
    lastName: FormControl;
    password: FormControl;
    userName: FormControl;
    email: FormControl;
  };

  ngOnInit(): void {
    this.addValidation();
  }

  addValidation(): void {
    this.formValidation = {
      userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20),
        this.checkUserNameAvailability.bind(this)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    };
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

  doRegistrationForPerson(): void {
    this.apiService.registerPerson(this.person).subscribe(resp => {
      this.snackBarService.showSnackBar('You have registered successfully', 'info', 4000);
      this.joinComponent.selectedTab(0);
    });
  }

  getErrorMessage(key: string): string {
    return this.errorUtils.extractErrorMessage(this.formValidation, key);
  }


}
