import { Component, OnInit } from '@angular/core';
import {ValuesService} from '../services/values.service';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 import {Client, NgxSoapService} from 'ngx-soap';
import {XmlParser} from '@angular/compiler/src/ml_parser/xml_parser';
// import {BasicHttpBinding, Proxy} from 'wcf.js';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

   client: Client;
  constructor(private valService: ValuesService, private _http: HttpClient, private soap: NgxSoapService) {

    const headers = new HttpHeaders({}); // 'Content-Type': 'text/xml', 'SOAPAction': 'http://tempuri.org/IQueryDrivenAPI/GetAllRawData'});
    this._http.get('http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/DataDrivenAPI/DataDrivenAPI.svc?wsdl',
      { headers: headers})
      .subscribe(data => console.log(data),
        error => console.log(error));
  }
  ngOnInit() {
    // const patients = this.valService.getPatients();
  }

}
