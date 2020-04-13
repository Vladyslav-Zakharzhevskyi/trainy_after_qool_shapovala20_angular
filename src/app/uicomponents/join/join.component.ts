import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {TranslationModule} from "../../config/translation.module";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JoinComponent {

  public _selectedTab: number;

  constructor(public translationModule: TranslationModule,
              public translation: TranslateService) {  }

  selectedTab(value: number) {
    this._selectedTab = value;
  }

}
