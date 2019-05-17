import { Component, OnInit } from '@angular/core';
import { IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import {ObjectToChartService} from './services/object-to-chart.service';
import {BaseServiceService} from './services/baseService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ObjectToChartService, BaseServiceService]
})
export class AppComponent implements OnInit {
  // public serched = true;
  title = 'Herzfeld';
  private fromDate: Date;
  private toDate: Date;
  optionsModel: number[];
  myOptions: IMultiSelectOption[];
  myOptions1: IMultiSelectOption[];

      // Multi Select Settings configuration
      public multiSelectSettings: IMultiSelectSettings = {
        enableSearch: true,
        showCheckAll: true,
        showUncheckAll: true
    };
    ngOnInit() {
        this.myOptions = [
            { id: 1, name: '123456789' },
            { id: 2, name: '545454545' },
            { id: 3, name: '111111111' },
            { id: 4, name: '000000000' },
            { id: 5, name: '258255454' },
            { id: 6, name: '311674564' },

        ];

      this.myOptions1 = [
        { id: 1, name: '1' },
        { id: 2, name: '2' },
        { id: 3, name: '3' },

      ];
    }
    onChange() {
        console.log(this.optionsModel);
    }
    private onInputChanged(which: string): void {
      // this.selectedPeriod = null;
      // if (which === 'from') {
      //     this.dtCorrectionsRequired.from = false;
      // } else if (which === 'to') {
      //     this.dtCorrectionsRequired.to = false;
      // }
      // this.validateInput();
  }
  private Submit() {
      // create a request for data base data or patient base
  }

}
