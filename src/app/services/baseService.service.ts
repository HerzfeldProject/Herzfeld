import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import {BasicHttpBinding, Proxy} from 'wcf.js';
import {from, Observable} from 'rxjs';
import {DataInstance} from '../models/dataInstance';
import {Plan} from '../models/plan';
import {LoadingScreenService} from './loading-screen.service';
// import {Observable} from 'rxjs';
// import * as $ from 'jquery';


@Injectable({
  providedIn: 'root'
})
export class BaseServiceService implements OnInit {

  public proxy;
  public message;
  constructor( private _http: HttpClient, private loadingScreenService: LoadingScreenService) { }

  ngOnInit() {
  }

  public getCompliance(request, callback)  {
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/complianceAPI/complianceAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';
    const message2 = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<GetCompliance xmlns="http://tempuri.org/">' +
      '<state>' + request.stage + '</state>' +
      '<patientsId>' + request.patientsList.toString() + '</patientsId>' +
      '<start>' + request.startDate.toISOString().substring(0, request.startDate.toISOString().indexOf('.')) + '</start>' +
      '<end>' + request.endDate.toISOString().substring(0, request.startDate.toISOString().indexOf('.')) + '</end>' +
      '<typeFlag>' + request.type + '</typeFlag>' +
      '<projectId>27</projectId>' +
      '</GetCompliance>' +
      '</s:Body>' +
      '</s:Envelope>';
    xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IComplianceAPI/GetCompliance');
    xmlreq.onreadystatechange = function () {
      if (xmlreq.readyState === 4) {
        if (xmlreq.status === 200 ) {
          const parser = new DOMParser();
          console.log(xmlreq.responseXML);
          const result = parser.parseFromString(xmlreq.responseXML.getElementsByTagName
          ('GetComplianceResult')[0].childNodes[0].textContent, 'text/xml');
          callback.apply(this, [result]);
        }
      }
    };
    // xmlreq.timeout = 4000; // Set timeout to 4 seconds (4000 milliseconds)
    xmlreq.send(message2);
  }
  public getSubPlanes(callback)  {
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/complianceAPI/complianceAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';
    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<GetSubPlans xmlns="http://tempuri.org/">' +
      '<projectId>27</projectId>' +
      '</GetSubPlans>' +
      '</s:Body>' +
      '</s:Envelope>';
    xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IComplianceAPI/GetSubPlans');
    xmlreq.onreadystatechange = function () {
      if (xmlreq.readyState === 4) {
        if (xmlreq.status === 200) {
          const result = xmlreq.responseXML.getElementsByTagName
          ('GetSubPlansResult')[0].childNodes;
          callback.apply(this, [result]);
        }
      }
    };
    xmlreq.send(message);
  }
  public getPatients(callback) {
  const xmlreq = new XMLHttpRequest();
  xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/AdministrationAPI/AdministrationAPI.svc', true);
  xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
  xmlreq.responseType = 'document';
    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<GetPatients xmlns="http://tempuri.org/">' +
      '<projectId>27</projectId>' +
      '</GetPatients>' +
      '</s:Body>' +
      '</s:Envelope>';
  xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IAdministrationService/GetPatients');
  xmlreq.onreadystatechange = function () {
    if (xmlreq.readyState === 4) {
      if (xmlreq.status === 200) {
        const result = xmlreq.responseXML.getElementsByTagName
        ('GetPatientsResult')[0].childNodes;
        console.log(result);
        callback.apply(this, [result]);
        // xmlreq.abort();
      }
    }
  };
  xmlreq.send(message);
}
  public getKnowledge(callback) {
    let result: XMLDocument;
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/complianceAPI/complianceAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';

    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<GetKnowledge xmlns="http://tempuri.org/">' +
      '<projectId>27</projectId>' +
      '</GetKnowledge>' +
      '</s:Body>' +
      '</s:Envelope>';
    xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IComplianceAPI/GetKnowledge');
    xmlreq.onreadystatechange = function () {
      if (xmlreq.readyState === 4) {
        if (xmlreq.status === 200) {
          const parser = new DOMParser();
          result = parser.parseFromString(xmlreq.responseXML.getElementsByTagName
          ('GetKnowledgeResult')[0].childNodes[0].textContent, 'text/xml');
          callback.apply(this, [result]);
          // xmlreq.abort();
        }
      }
    };
    xmlreq.send(message);
    if (xmlreq.readyState === 4) {
      return result;
    }
  }
  public getData(request, concept, callback) {
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/queryDrivenAPI/queryDrivenAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';

    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<GetData xmlns="http://tempuri.org/">' +
      '<projectId>27</projectId>' +
      '<patientIds>' + request.patientsList.toString() + '</patientIds>' +
      '<conceptId>' + concept + '</conceptId>' +
      '<necessaryContexts/>' +
      '<exclusionContexts />' +
      '<contextFlag>9</contextFlag>' +
      '</GetData>' +
      '</s:Body>' +
      '</s:Envelope>';
    xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IQueryDrivenAPI/GetData');
    xmlreq.onreadystatechange = function () {
      if (xmlreq.readyState === 4) {
        if (xmlreq.status === 200) {
          callback.apply(this, [xmlreq.responseXML.getElementsByTagName('GetDataResult')[0].childNodes]);
          // xmlreq.abort();
        }
      }
    };
    xmlreq.send(message);
    //xmlreq.abort();
  }
  public authenticate(user, callback){
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/AdministrationAPI/AdministrationAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';
    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<Authenticate xmlns="http://tempuri.org/">' +
      '<projectId>27</projectId>' +
      '<userName>' + user.username + '</userName>' +
      '<password>' + user.password + '</password>' +
      '</Authenticate>' +
      '</s:Body>' +
      '</s:Envelope>';
    xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IAdministrationService/Authenticate');

    xmlreq.onreadystatechange = function () {
      if (xmlreq.readyState === 4 && xmlreq.status === 200 ) {
        // const result = xmlreq.responseXML.getElementsByTagName('AuthenticateResult')[0].innerHTML;
        callback.apply(this, [xmlreq.responseXML]);
        // xmlreq.abort();
      }
      // else if (xmlreq.readyState === 4 && xmlreq.status === 0) {
      //   callback.apply(this, [null]);
      // }
    };
    // xmlreq.onreadystatechange = function () {
    //   if (xmlreq.readyState === 4 && xmlreq.status === 200 ) {
    //       const result = xmlreq.responseXML.getElementsByTagName('AuthenticateResult')[0].innerHTML;
    //       callback.apply(this, [result]);
    //     }
    // };
    // xmlreq.timeout = 4000; // Set timeout to 4 seconds (4000 milliseconds)
    // xmlreq.ontimeout = function () { alert("Timed out!!!"); }
    xmlreq.send(message);
    }
  }
