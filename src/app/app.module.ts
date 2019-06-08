import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatFormFieldModule,
  MatDatepicker,
  MatDatepickerToggle,
  MatDialog,
  MatDialogModule,
  MatSelectModule,
  MatOptionModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule, MatExpansionModule, MatAccordion
} from '@angular/material';
import { AdmissionDashboardComponent } from './admission-dashboard/admission-dashboard.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FollowUpDashboardComponent } from './follow-up-dashboard/follow-up-dashboard.component';
import { PreventionDashboardComponent } from './prevention-dashboard/prevention-dashboard.component';
import { TreatmentDashboardComponent } from './treatment-dashboard/treatment-dashboard.component';
import { SummaryDashboardComponent } from './summary-dashboard/summary-dashboard.component';
import {AngularFireModule} from '@angular/fire';
import { environment} from '../environments/environment';
import { LoginComponent } from './authentication/login/login.component';
import { NavModule } from './nav/nav.module';
import { StartComponent } from './start/start.component';
import {HttpModule} from '@angular/http';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {GoogleChartsModule} from 'angular-google-charts';
import {Concepts} from './models/concepts';
import {Weights} from './models/weights';
import { BandagingDashboardComponent } from './bandaging-dashboard/bandaging-dashboard.component';
// import {ModalModule} from 'ng2-modal';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { ProtocolModalComponent } from './protocol-modal/protocol-modal.component';

// import {NgxSoapModule} from 'ngx-soap';
// import {Proxy, BasicHttpBinding} from 'wcf.js';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AdmissionDashboardComponent,
    FollowUpDashboardComponent,
    PreventionDashboardComponent,
    TreatmentDashboardComponent,
    SummaryDashboardComponent,
    LoginComponent,
    StartComponent,
    BandagingDashboardComponent,
    LoadingScreenComponent,
    ProtocolModalComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    // NgxSoapModule,
    // Proxy, BasicHttpBinding, ////
    GoogleChartsModule.forRoot(),
    // ModalModule,
    HttpClientModule,
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
    MatSidenavModule,
    MatExpansionModule,
    // MatAccordion,
    MultiselectDropdownModule,
    ChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NavModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule, MatFormFieldModule, MatExpansionModule, MatAccordion, MatSidenavModule, MatButtonModule, MatInputModule
  ],
  providers: [ Weights, Concepts],
  bootstrap: [AppComponent],
  entryComponents: [ProtocolModalComponent]
})
export class AppModule { }
