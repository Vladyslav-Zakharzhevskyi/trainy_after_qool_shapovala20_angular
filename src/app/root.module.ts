import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RoutingModule } from './routing.module';
import { TranslationModule } from './service/translation.module';

import { RegistrationComponent } from './uicomponents/bootstrap-registration/registration.component';
import { LoginComponent } from './uicomponents/bootstrap-login/login.component';
import { BootstrapProfileComponent } from './uicomponents/bootstrap-profile/bootstrap-profile.component';
import { PersonsComponent } from './uicomponents/persons/persons.component';

import { ApplicationWrapperComponent } from './uicomponents/application-wrapper.component';
import { ApplicationEntryPointComponent } from './uicomponents/applications/application-entry-point.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestAuthTokenInterceptor } from './api/interceptors/request-auth-token-interceptor.service';
import { HeaderComponent } from './uicomponents/header/header.component';
import { AuthenticationListenerService } from './system/authentication-listener.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResponseErrorInterceptor } from './api/interceptors/response-error-interceptor';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    ApplicationWrapperComponent,
    LoginComponent,
    BootstrapProfileComponent,
    RegistrationComponent,
    ApplicationEntryPointComponent,
    PersonsComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    GoogleMapsModule,
    HttpClientModule,
    RoutingModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RequestAuthTokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ResponseErrorInterceptor, multi: true}
  ],

  bootstrap: [ApplicationWrapperComponent]
})
export class RootModule {

  constructor(private customAuthenticationListener: AuthenticationListenerService) { }

}
