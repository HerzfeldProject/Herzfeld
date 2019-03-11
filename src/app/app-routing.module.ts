import { NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FollowUpDashboardComponent } from './follow-up-dashboard/follow-up-dashboard.component';

const routes: Route[] = [
  {path: '', pathMatch: 'full', redirectTo: 'admission'},
  {path: 'admission', component: DashboardComponent},
  {path: 'followup' , component: FollowUpDashboardComponent},
  {path: 'prevention', component: DashboardComponent},
  {path: 'treatment', component: DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
