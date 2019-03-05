import { NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {FollowupComponent} from './followup/followup.component';
import {PreventionComponent} from './prevention/prevention.component';
import {TreatmentComponent} from './treatment/treatment.component';
import { DashboardComponent } from './followup/dashboard/dashboard.component';

const routes: Route[] = [
  {path: '', pathMatch: 'full', redirectTo: 'followup'},
  {path: 'followup', component: DashboardComponent},
  {path: 'prevention', component: PreventionComponent},
  {path: 'treatment', component: TreatmentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
