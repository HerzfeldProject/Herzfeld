import {Component, Input, OnInit} from '@angular/core';
import {BaseServiceService} from '../services/baseService.service';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 import {Client, NgxSoapService} from 'ngx-soap';
import {XmlParser} from '@angular/compiler/src/ml_parser/xml_parser';
import {IMultiSelectOption, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
// import {BasicHttpBinding, Proxy} from 'wcf.js';
import { NgxXml2jsonService } from 'ngx-xml2json';
import {timeBaseDataRequest} from '../models/timeBaseDataRequest';
import {patientBaseDataRequest} from '../models/patientBaseDataRequest';
// import {parser} from 'xml2json';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  public serched = true;
  fromDate: Date;
  toDate: Date;
  selectedBase: string;
  optionsModel: string[];
  myOptions: IMultiSelectOption[];
  myOptions1: IMultiSelectOption[];

  public multiSelectSettings: IMultiSelectSettings = {
    enableSearch: true,
    showCheckAll: true,
    showUncheckAll: true
  };
  client: Client;
  private dtCorrectionsRequired = {
    from: false,
    to: false
  };
  constructor(private valService: BaseServiceService, private _http: HttpClient, private basesrv: BaseServiceService) {
    // console.log(this.basesrv.getKnowledge());
    this.basesrv.getPatients();
  }
  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date();
    // const patients = this.valService.getPatients();
    this.myOptions = [
      { id: 1, name: '123456789' },
      { id: 2, name: '545454545' },
      { id: 3, name: '111111111' },
      { id: 4, name: '000000000' },
      { id: 5, name: '258255454' },
      { id: 6, name: '311674564' },

    ];
  }
  Submit() {
    const dateto = new Date(this.fromDate.getTime() + this.fromDate.getTimezoneOffset())
    let request = null;
    if (this.selectedBase === '1') {
      request = new timeBaseDataRequest();
      request.patientsList = this.optionsModel;
      request.startDate = this.fromDate;
      request.endData = this.toDate;
    } else if (this.selectedBase === '2') {
      request = new patientBaseDataRequest();
      request.patientsList = this.optionsModel;
      request.startDate = this.fromDate;
      request.endData = this.toDate;
    }

    // getCompliance
    // const result = this.basesrv.getCompliance(request);
    // parser.xmlToJson(result)
     this.serched = false;
  }

}
