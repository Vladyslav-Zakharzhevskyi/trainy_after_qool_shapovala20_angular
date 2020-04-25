import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationEntryPointComponent } from './uicomponents/applications/application-entry-point.component';
import { RegistrationComponent } from './uicomponents/bootstrap-registration/registration.component';
import { LoginComponent } from './uicomponents/bootstrap-login/login.component';


const routes: Routes = [
  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: 'applications', component:  ApplicationEntryPointComponent},
  { path: '**', component: LoginComponent}
];

@NgModule({
  imports: [ BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
