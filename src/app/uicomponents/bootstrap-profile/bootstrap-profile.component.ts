import { Component , OnInit } from '@angular/core';
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
export class BootstrapProfileComponent implements OnInit {
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
}
