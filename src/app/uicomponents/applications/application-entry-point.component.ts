import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'application-application-entry-point',
  templateUrl: './application-entry-point.component.html',
  styleUrls: ['./application-entry-point.component.css']
})
export class ApplicationEntryPointComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }


}
