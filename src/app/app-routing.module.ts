import { NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import { AdmissionDashboardComponent } from './admission-dashboard/admission-dashboard.component';
import { FollowUpDashboardComponent } from './follow-up-dashboard/follow-up-dashboard.component';
import { PreventionDashboardComponent } from './prevention-dashboard/prevention-dashboard.component';
import { TreatmentDashboardComponent } from './treatment-dashboard/treatment-dashboard.component';
import { SummaryDashboardComponent } from './summary-dashboard/summary-dashboard.component';
import {LoginComponent} from './authentication/login/login.component';

const routes: Route[] = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'login', component: LoginComponent}
  // {path: 'admission', component: AdmissionDashboardComponent},
  // {path: 'followup' , component: FollowUpDashboardComponent},
  // {path: 'prevention', component: PreventionDashboardComponent},
  // {path: 'treatment', component: TreatmentDashboardComponent},
  // {path: 'summary', component: SummaryDashboardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
