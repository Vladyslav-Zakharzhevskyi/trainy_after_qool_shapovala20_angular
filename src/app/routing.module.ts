import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {JoinComponent} from './uicomponents/join/join.component';
import {ApplicationEntryPointComponent} from './uicomponents/applications/application-entry-point.component';
import {RegistrationComponent} from './uicomponents/bootstrap-registration/registration.component';


const routes: Routes = [
  { path: 'registration', component: RegistrationComponent},
  { path: 'join', component: JoinComponent},
  { path: 'applications', component:  ApplicationEntryPointComponent},
  { path: '**', component: JoinComponent}
];

@NgModule({
  imports: [ BrowserModule, RouterModule.forRoot(
      routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
