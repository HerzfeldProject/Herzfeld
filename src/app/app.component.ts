import { Component, OnInit } from '@angular/core';
import { IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Herzfeld';
  private fromDate: Date;
  private toDate: Date;
  optionsModel: number[];
    myOptions: IMultiSelectOption[];

      // Multi Select Settings configuration
      private multiSelectSettings: IMultiSelectSettings = {
        enableSearch: true,
        showCheckAll: true,
        showUncheckAll: true
    };
    ngOnInit() {
        this.myOptions = [
            { id: 1, name: 'Option 1' },
            { id: 2, name: 'Option 2' },
            { id: 3, name: 'Option 3' },
            { id: 4, name: 'Option 4' },
            { id: 5, name: '25825' },
            { id: 6, name: '31167' },

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

}
