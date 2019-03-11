import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatFormFieldModule, MatDatepicker, MatDatepickerToggle, MatDialog, MatDialogModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FollowUpDashboardComponent } from './follow-up-dashboard/follow-up-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    MatDatepicker,
    MatDatepickerToggle,
    FollowUpDashboardComponent
  ],
  imports: [
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
    OwlNativeDateTimeModule

  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
