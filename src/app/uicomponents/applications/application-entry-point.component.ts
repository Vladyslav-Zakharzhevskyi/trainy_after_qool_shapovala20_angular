import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { AuthenticationState, AuthenticationStateService } from '../../service/subjects/authentication-state.service';

@Component({
  selector: 'application-application-entry-point',
  templateUrl: './application-entry-point.component.html',
  styleUrls: ['./application-entry-point.component.css']
})
export class ApplicationEntryPointComponent implements OnInit {

  constructor(private route: Router,
              private authState: AuthenticationStateService,
              private api: ApiService) { }

  ngOnInit(): void {}


  public logout(): void {
    this.api.logout().subscribe(successLogout => {
      this.authState.setState(new AuthenticationState(false, undefined, undefined));
      }
    );
  }
}
