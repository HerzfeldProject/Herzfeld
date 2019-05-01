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
export class BaseServiceService implements OnInit {

  public proxy;
  public message;
  public
  constructor( private _http: HttpClient) { }

  ngOnInit() { }

  public getCompliance(request)  {
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/complianceAPI/complianceAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';
    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<GetCompliance xmlns="http://tempuri.org/">' +
      '<state>followUp</state>' +
      '<patientsId>2</patientsId>' +
      '<start>2016-04-20T17:06:00</start>' +
      '<end>2019-04-20T17:06:00</end>' +
      '<typeFlag>1</typeFlag>' +
      '<projectId>27</projectId>' +
      '</GetCompliance>' +
      '</s:Body>' +
      '</s:Envelope>';
    xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IComplianceAPI/GetCompliance');
    xmlreq.onreadystatechange = function () {
      if (xmlreq.readyState === 4) {
        if (xmlreq.status === 200) {
           return xmlreq.responseXML;
        }
      }
    };
    xmlreq.send(message);
  }
  public getSubPlanes()  {
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
          console.log(xmlreq.responseXML);
        }
      }
    };
    xmlreq.send(message);
  }
  public getPatients() {
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
        console.log(xmlreq.response);
      }
    }
  };
  xmlreq.send(message);
}
  public getKnowledge() {
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
        }
      }
    };
    xmlreq.send(message);
    if (xmlreq.readyState === 4) {
      return result;
    }
  }
  public getData(request) {
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/queryDrivenAPI/queryDrivenAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';

    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<GetData xmlns="http://tempuri.org/">' +
      '<projectId>27</projectId>' +
      '<patientIds>1</patientIds>' +
      '<conceptId>10870</conceptId>' +
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
          return xmlreq.responseXML;
        }
      }
    };
    xmlreq.send(message);
  }
  public authenticate(user) {
    const xmlreq = new XMLHttpRequest();
    xmlreq.open('POST', 'http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/AdministrationAPI/AdministrationAPI.svc', true);
    xmlreq.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xmlreq.responseType = 'document';

    const message = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '<s:Body>' +
      '<Authenticate xmlns="http://tempuri.org/">' +
      '<projectId>27</projectId>' +
      '<userName>erez</userName>' +
      '<password>1234</password>' +
      '</Authenticate>' +
      '</s:Body>' +
      '</s:Envelope>';
    xmlreq.setRequestHeader('SOAPAction', 'http://tempuri.org/IAdministrationService/Authenticate');
    xmlreq.onreadystatechange = function () {
      if (xmlreq.readyState === 4) {
        if (xmlreq.status === 200) {
          console.log(xmlreq.responseXML);
        }
      }
    };
    xmlreq.send(message);

  }

}
