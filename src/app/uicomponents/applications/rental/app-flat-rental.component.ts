import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderConfig} from "../../header/header-config.type";
import {HeaderItem} from "../../header/header-item.type";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-flat-rental',
  templateUrl: './app-flat-rental.component.html',
  styleUrls: ['./app-flat-rental.component.css']
})
export class AppFlatRentalComponent implements OnInit{

  public headerConfig: HeaderConfig = new HeaderConfig(this.translation, [
    new HeaderItem("advertisement.all", "", {tab: 'dashboard'}),
    new HeaderItem("advertisement.add", "", {tab: 'manage'}),
    new HeaderItem("advertisement.my", "", {tab: 'my'})]
  );

  public activeTab: string = '';

  constructor(private route: ActivatedRoute,
              private translation: TranslateService) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(paramHolder => {
      this.activeTab = paramHolder.get("tab");
    });
  }




}
