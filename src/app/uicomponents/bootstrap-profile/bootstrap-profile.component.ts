/// <reference types="@types/googlemaps" />

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Person } from '../../_models/person';
import { CustomToastrService } from '../../service/util/custom-toastr.service';
import { RequestType } from '../../_models/request-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'application-bootstrap-profile',
  templateUrl: './bootstrap-profile.component.html',
  styleUrls: ['./bootstrap-profile.component.css']
})
export class BootstrapProfileComponent implements OnInit, AfterViewInit {
  public personProfile: Person = new Person();
  public positions: any = [];
  public currency: any = [];

  constructor(private api: ApiService,
              private toastrService: CustomToastrService,
              private translateService: TranslateService) {

    this.initProfilePage();
  }

  ngOnInit(): void {
    this.api.getCurrentPerson().subscribe(person => {
      this.personProfile = person;
    });
  }

  ngAfterViewInit(): void {
    this.initGoogleMapsAutocompleteAddress();
  }



  initProfilePage(): void {
    this.api.getServerData(RequestType.ENUM, 'Currency').subscribe(response => this.currency = response);
    this.api.getServerData(RequestType.REPOSITORY, 'position').subscribe(response => this.positions = response);
  }

  updatePersonProfile(): void {
    this.api.savePerson(this.personProfile).subscribe(response => {
      this.personProfile = response;
      this.toastrService.success('', this.translateService.instant('notification.profile.updated.title'));
    });
  }

  getCurrency(curr: string): string {
    if (curr === 'US') {
      return '$';
    } else if (curr === 'UAH') {
      return '₴';
    }

    return '';
  }

  getPositionTitle(positionId: number): void {
    const posObj = this.positions.find(position => position.id === positionId);
    return posObj ? posObj.position : '';
  }

  initGoogleMapsAutocompleteAddress(): void {
    const autocompleteInput = document.getElementById('address_autocomplete') as HTMLInputElement;

    let autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {types: ['geocode']});
    autocomplete.setFields(['address_component']);

    autocomplete.setComponentRestrictions({country: ['ua']});

    // tslint:disable-next-line:typedef
    autocomplete.addListener('place_changed', function() {
      console.log(`Place changed to: ${autocomplete.getPlace()}`);
    });
  }
}
