import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppFlatRentalComponent} from "./uicomponents/applications/rental/app-flat-rental.component";
import {BrowserModule} from "@angular/platform-browser";
import {JoinComponent} from "./uicomponents/join/join.component";
import {ApplicationEntryPointComponent} from "./uicomponents/applications/application-entry-point.component";


const routes: Routes = [
  { path: "join", component: JoinComponent},
  { path: "applications", component:  ApplicationEntryPointComponent},
  { path: "application/rental", component: AppFlatRentalComponent},
  { path: '**', component: JoinComponent}
];

@NgModule({
  imports: [ BrowserModule, RouterModule.forRoot(
      routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
