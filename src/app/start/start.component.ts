import {Component, Input, OnInit, Output} from '@angular/core';
import {BaseServiceService} from '../services/baseService.service';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 import {Client, NgxSoapService} from 'ngx-soap';
import {XmlParser} from '@angular/compiler/src/ml_parser/xml_parser';
import {IMultiSelectOption, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
// import {BasicHttpBinding, Proxy} from 'wcf.js';
import { NgxXml2jsonService } from 'ngx-xml2json';
import {DataRequest} from '../models/dataRequest';
import {DataInstance} from '../models/dataInstance';
import {Plan} from '../models/plan';
// import {parser} from 'xml2json';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  @Input() mainRequest: DataRequest;
  public serched = true;
  fromDate: Date;
  toDate: Date;
  selectedBase: string;
  optionsModel: string[];
  patients: NodeList = null;
  myOptions: IMultiSelectOption[] = [];

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
  }
  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.basesrv.getPatients(data => {
      this.patients = data;
      if (this.patients.length > 0) {
        for (let i = 0; i < this.patients.length; i++) {
          this.myOptions.push({id: this.patients.item(i).textContent, name: this.patients.item(i).textContent});
        }
      }});
  }
  Submit() {
    const request = new DataRequest();
    if (this.selectedBase === '1') {
      request.type = 1;
    } else if (this.selectedBase === '2') {
      request.type = 2;
    }
    request.patientsList = this.optionsModel;
    request.startDate = this.fromDate;
    request.endDate = this.toDate;
    request.stage = 'followUp' ; // The first stage you want to see
    this.mainRequest = request;
    this.serched = false;
    // this.basesrv.getCompliance(request, data => {
    //   const plan = this.basesrv.prepareXMLofCompliance(data);
    //   console.log(plan);
    //   this.serched = false;
    // });
    // this.basesrv.getSubPlanes(data => {
    //   console.log(data);
    // });
    // this.basesrv.getKnowledge();
    // this.basesrv.getData(request, data => {
    //   console.log(data);
    //   const dataInstances = [];
    //   if (data.length > 0) {
    //     for (let i = 0; i < data.length; i++) {
    //       const temp = new DataInstance();
    //       temp.conceptName = data.item(i).childNodes[0].innerHTML;
    //       temp.endTime = data.item(i).childNodes[1].innerHTML;
    //       temp.entityId = data.item(i).childNodes[2].innerHTML;
    //       temp.startTime = data.item(i).childNodes[3].innerHTML;
    //       temp.value = data.item(i).childNodes[4].innerHTML;
    //       dataInstances.push(temp);
    //     }
    //   }
    // });
  }
  // prepareXMLofCompliance(data) {
  //   const start = data.childNodes;
  //   let plan;
  //   if (start[0].nodeName.toString().toLowerCase().includes('plan')) {
  //     plan = new Plan();
  //     plan.name = start[0].attributes.name.nodeValue;
  //     if (start[0].attributes.concept_id !== undefined) {
  //       plan.conceptId = start[0].attributes.concept_id.nodeValue;
  //     }
  //     plan.weight = start[0].attributes.weight.nodeValue;
  //     plan.score = start[0].attributes.score.nodeValue;
  //     plan.subPlans = [];
  //   }
  //   for (let i = 0; i < start[0].children.length; i++) {
  //     if ( start[0].children[i].nodeName.toString().toLowerCase().includes('plan')) {
  //       plan.subPlans.push(this.createSubPlan( start[0].children[i]));
  //     }
  //   }
  //   return plan;
  // }
  // createSubPlan(start) {
  //   const plan = new Plan();
  //   plan.name = start.attributes.name.nodeValue;
  //   if (start.attributes.concept_id !== undefined) {
  //     plan.conceptId = start.attributes.concept_id.nodeValue;
  //   }
  //   plan.weight = start.attributes.weight.nodeValue;
  //   plan.score = start.attributes.score.nodeValue;
  //   plan.subPlans = [];
  //   if (start.children[0].nodeName.toString().toLowerCase().includes( 'plans')) {
  //     // go over every plan and check if 'plans' or other
  //     const childs = start.children[0].children;
  //     for (let j = 0; j < childs.length; j++) {
  //       if (childs[j].nodeName.toString().toLowerCase().includes( 'plan')) {
  //         plan.subPlans.push(this.createSubPlan(childs[j]));
  //       }
  //     }
  //   } else {
  //     for (let k = 0; k < start.children.length; k++) {
  //       const sub = new Plan();
  //       sub.name = start.children[k].localName;
  //       plan.subPlans.push(sub);
  //     }
  //   }
  //   return plan;
  // }


}
