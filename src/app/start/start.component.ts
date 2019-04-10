import { Component, OnInit } from '@angular/core';
import {ValuesService} from '../services/values.service';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 import {Client, NgxSoapService} from 'ngx-soap';
import {XmlParser} from '@angular/compiler/src/ml_parser/xml_parser';
import {IMultiSelectOption, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
// import {BasicHttpBinding, Proxy} from 'wcf.js';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  private fromDate: Date;
  private toDate: Date;
  optionsModel: number[];
  myOptions: IMultiSelectOption[];
  myOptions1: IMultiSelectOption[];

  public multiSelectSettings: IMultiSelectSettings = {
    enableSearch: true,
    showCheckAll: true,
    showUncheckAll: true
  };
  client: Client;
  constructor(private valService: ValuesService, private _http: HttpClient, private soap: NgxSoapService) {

    const headers = new HttpHeaders({}); // 'Content-Type': 'text/xml'}); // , 'SOAPAction': 'http://tempuri.org/IQueryDrivenAPI/GetAllRawData'});
    this._http.get('https://medinfo2.ise.bgu.ac.il/chronicpaintest/wcf/service1.svc/jsonp/activatepatient',
      {observe: 'body', params: {'patientInitCode': '5345'}})
      .subscribe(data => console.log(data),
        error => console.log(error));


    // const xmlreq = new XMLHttpRequest();
    // const message = '<xml version="1.0" encoding="utf-8">\n' +
    //   '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
    //   '<s:Header />\n' +
    //   '<s:Body>\n' +
    //   '<GetAllRawData xmlns="http://tempuri.org/">\n' +
    //   '<projectId>9</projectId>\n' +
    //   '<entityId>15</entityId>\n' +
    //   '</GetAllRawData>\n' +
    //   '</s:Body>\n' +
    //   '</s:Envelope>';
    // // xmlreq.open('GET', 'http://132.72.65.196/MediatorNewTAK/DataDrivenAPI/DataDrivenAPI.svc?wsdl', true);
    //
    // // xmlreq.setRequestHeader('Access-Control-Allow-Origin','*');
    //  xmlreq.setRequestHeader('Content-Type', 'text/xml');
    // // xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IQueryDrivenAPI/GetAllRawData');
    // xmlreq.onreadystatechange = function () {
    //   if (xmlreq.readyState === 4) {
    //     if (xmlreq.status === 200) {
    //       console.log(xmlreq.response);
    //     }
    //   }
    // };
    // xmlreq.withCredentials = true;
    // // xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IQueryDrivenAPI/GetAllRawData');
    // // xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    // xmlreq.responseType = 'document';
    // xmlreq.send(message);
  }
  ngOnInit() {
    // const patients = this.valService.getPatients();
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
  Submit() {

  }

}
