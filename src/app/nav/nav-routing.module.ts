import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdmissionDashboardComponent} from '../admission-dashboard/admission-dashboard.component';
import {FollowUpDashboardComponent} from '../follow-up-dashboard/follow-up-dashboard.component';
import {PreventionDashboardComponent} from '../prevention-dashboard/prevention-dashboard.component';
import {TreatmentDashboardComponent} from '../treatment-dashboard/treatment-dashboard.component';
import {SummaryDashboardComponent} from '../summary-dashboard/summary-dashboard.component';
import {NavComponent} from './nav.component';
import {StartComponent} from '../start/start.component';
import {BandagingDashboardComponent} from '../bandaging-dashboard/bandaging-dashboard.component';

const routes: Routes = [
  {
    path: 'nav',
    component: StartComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'nav'},
      {path: 'admission', component: AdmissionDashboardComponent},
      {path: 'followup' , component: FollowUpDashboardComponent},
      {path: 'prevention', component: PreventionDashboardComponent},
      {path: 'treatment', component: TreatmentDashboardComponent},
      {path: 'summary', component: SummaryDashboardComponent},
      {path: 'bandage', component: BandagingDashboardComponent},
    ],
    // canActivate: [AuthenticationGuard],
    runGuardsAndResolvers: 'always',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class NavRoutingModule { }
