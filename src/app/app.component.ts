import { Component, OnInit } from '@angular/core';
import { IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import {ObjectToChartService} from './services/object-to-chart.service';
import {BaseServiceService} from './services/baseService.service';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ObjectToChartService, BaseServiceService],
  entryComponents: []
})
export class AppComponent implements OnInit {
  title = 'Herzfeld';

    ngOnInit() {
    }
    onChange() {
    }
    private onInputChanged(which: string): void {
  }
  private Submit() {
  }

}
