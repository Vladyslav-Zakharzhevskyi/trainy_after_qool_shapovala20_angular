import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RoutingModule } from './routing.module';
import { AngularMaterialModule} from './config/angular-material-module';
import {TranslationModule} from "./config/translation.module";

import { PersonsComponent } from './uicomponents/persons/persons.component';
import { RegistrationFormComponent } from './uicomponents/register/registration-form.component';
import { LoginFormComponent } from "./uicomponents/login/login-form.component";

import { ApplicationWrapperComponent } from './uicomponents/application-wrapper.component';
import { ApplicationEntryPointComponent } from './uicomponents/applications/application-entry-point.component'
import { AppFlatRentalComponent } from './uicomponents/applications/rental/app-flat-rental.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JoinComponent } from './uicomponents/join/join.component';
import { RequestAuthTokenInterceptor } from "./api/interceptors/request-auth-token-interceptor.service";
import { HeaderComponent } from './uicomponents/header/header.component';
import { AdvertisementComponent } from './uicomponents/applications/rental/sections/advertisment/advertisement.component';
import {AuthenticationListenerService} from "./system/authentication-listener.service";


@NgModule({
  declarations: [
    PersonsComponent,
    AppFlatRentalComponent,
    RegistrationFormComponent,
    LoginFormComponent,
    JoinComponent,
    HeaderComponent,
    ApplicationWrapperComponent,
    ApplicationEntryPointComponent,
    AdvertisementComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    AngularMaterialModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestAuthTokenInterceptor,
    multi: true }],

  bootstrap: [ApplicationWrapperComponent]
})
export class RootModule {

  constructor(private customAuthenticationListener: AuthenticationListenerService) { }

}
