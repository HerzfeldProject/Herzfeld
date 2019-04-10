import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import {BasicHttpBinding, Proxy} from 'wcf.js';
import {from} from 'rxjs';
import {DataInstance} from '../models/dataInstance';
// import {Observable} from 'rxjs';
// import * as $ from 'jquery';


@Injectable({
  providedIn: 'root'
})
export class ValuesService implements OnInit {

  public proxy;
  public message;
  constructor( private _http: HttpClient) { }
  ngOnInit() { }
  public getPatientsByDepatrments(departments): DataInstance[]  {
    return [];
  }
  public getPatients(): DataInstance[]  {
    return [];
  }
  public getData(conceptId, patientsIds): DataInstance[] {
    return [];
  }
  public getKnowledge() {
    // get json with all the data that needed.
  }

}
