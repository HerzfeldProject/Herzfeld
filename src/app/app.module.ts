import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatFormFieldModule, MatDatepicker, MatDatepickerToggle, MatDialog, MatDialogModule, MatSelectModule, MatOptionModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FollowUpDashboardComponent } from './follow-up-dashboard/follow-up-dashboard.component';
import { PreventionDashboardComponent } from './prevention-dashboard/prevention-dashboard.component';
import { TreatmentDashboardComponent } from './treatment-dashboard/treatment-dashboard.component';
import { FollowupTableComponent } from './follow-up-dashboard/followup-table/followup-table.component';
import { SummaryDashboardComponent } from './summary-dashboard/summary-dashboard.component';
import {AngularFireModule} from '@angular/fire';
import { environment} from '../environments/environment';
import { LoginComponent } from './authentication/login/login.component';
import { NavModule } from './nav/nav.module';
import { StartComponent } from './start/start.component';
import {NgxSoapModule} from 'ngx-soap';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    FollowUpDashboardComponent,
    PreventionDashboardComponent,
    TreatmentDashboardComponent,
    FollowupTableComponent,
    SummaryDashboardComponent,
    LoginComponent,
    StartComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    NgxSoapModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MultiselectDropdownModule,
    ChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NavModule

  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
