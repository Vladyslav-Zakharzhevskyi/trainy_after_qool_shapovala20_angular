import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { AuthenticationState, AuthenticationStateService } from '../../system/authentication-state.service';
import { timer } from 'rxjs';
import { Offer } from '../../_models/offer';
import { environment } from '../../../environments/environment';
import { CustomToastrService } from '../../service/util/custom-toastr.service';
import { SecurityContext } from '../../system/security-context.service';
import { LoginComponent } from '../bootstrap-login/login.component';
import { filter } from 'rxjs/operators';
import { RouteParamsReserved } from '../../service/const/route-params-reserved.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'application-application-entry-point',
  templateUrl: './application-entry-point.component.html',
  styleUrls: ['./application-entry-point.component.css']
})
export class ApplicationEntryPointComponent implements OnInit {

  private SHOW_TIMEOUT: number = +`${environment.production ? 4000 : 500}`;

  public offers: Offer[] = [];
  public currentOffer: Offer = new Offer();

  public responseReceived = false;
  public showAnimation = true;

  constructor(public securityContext: SecurityContext,
              public route: Router,
              private authState: AuthenticationStateService,
              private api: ApiService,
              private toastrService: CustomToastrService,
              private activatedRoute: ActivatedRoute,
              private loginComponent: LoginComponent,
              private translateService: TranslateService) {
    this.ensureExternalLogin();
  }

  ensureExternalLogin(): void {
    const param = RouteParamsReserved.RESERVED_URL_PARAM_EXTERNAL_LOGIN;
    const EXTERNAL_LOGIN_OBSERVABLE = this.activatedRoute.queryParams.pipe(filter(params => params[param]));

    EXTERNAL_LOGIN_OBSERVABLE.subscribe((params: Params)  => {
      this.loginComponent.authenticate(params[param]);
    });
  }

  ngOnInit(): void {
    this.api.getProposalsToImplement().subscribe(offers => {
      this.responseReceived = true;
      this.offers = offers;
      timer(this.SHOW_TIMEOUT).subscribe(_timer => {
        this.showAnimation = false;
      });
    });
  }


  postOffer(): void {
    if (this.currentOffer && this.currentOffer.id) {
      this.updateOffer();
    } else {
      this.createOffer();
    }
  }

  private createOffer(): void {
    this.api.addProposal(this.currentOffer).subscribe(offers => {
      this.offers = offers;
      this.cancelEditing();
      this.toastrService.success('Your recommendation has been added!', 'Thank you!');
    });
  }

  private updateOffer(): void {
    this.api.updateProposal(this.currentOffer).subscribe(offers => {
      this.offers = offers;
      this.cancelEditing();
      this.toastrService.info('', 'Your have updated your recommendation successfully!');
    });
  }

  deleteOffer(offerId: number): void {
    this.api.deleteProposal(offerId).subscribe(offers => {
      this.offers = offers;
      this.toastrService.info('', 'This recommendation deleted successfully!');
    });
  }

  editOffer(offer: Offer): void {
    if (offer) {
      this.currentOffer = offer;
    }
  }

  cancelEditing(): void {
    this.currentOffer = new Offer();
  }

  public logout(): void {
    console.log('Logout called');
    this.api.logout().subscribe(successLogout => {
      this.authState.setState(new AuthenticationState(false, undefined, undefined, {}));
      }
    );
  }


  getDate(offer: Offer): string {
    return offer.dateUpdated ? offer.dateUpdated : offer.dateCreated;
  }

  getSendProposalBtnText(): string {
    let key = this.currentOffer.id ? 'EDIT_PROPOSAL_BTN_TEXT' : 'ADD_PROPOSAL_BTN_TEXT';
    return this.translateService.instant(key);
  }

}
