import {Component, Input, OnInit, Output} from '@angular/core';
import {BaseServiceService} from '../services/baseService.service';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 import {Client, NgxSoapService} from 'ngx-soap';
import {XmlParser} from '@angular/compiler/src/ml_parser/xml_parser';
import {IMultiSelectOption, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
// import {BasicHttpBinding, Proxy} from 'wcf.js';
// import { NgxXml2jsonService } from 'ngx-xml2json';
import {DataRequest} from '../models/dataRequest';
import {XmlToObjectService} from '../services/xml-to-object.service';
import {SharedRequestService} from '../services/shared-request.service';
import {LoadingScreenService} from '../services/loading-screen.service';
import {Router} from '@angular/router';
import {ProtocolModalComponent} from '../protocol-modal/protocol-modal.component';
import {MatDialog} from '@angular/material';
// import {DataInstance} from '../models/dataInstance';
// import {Plan} from '../models/plan';
// import {parser} from 'xml2json';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  selectedDepartment: string;
  mainRequest: DataRequest;
  public serched = true;
  fromDate: Date;
  toDate: Date;
  selectedBase: string;
  optionsModel: string[];
  patients: NodeList = null;
  department = null;
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
  constructor(private valService: BaseServiceService,    private router: Router,
              private _http: HttpClient, private dialog: MatDialog,  private basesrv: BaseServiceService, private xmltosrv: XmlToObjectService, private sharedR: SharedRequestService, private loadingScreenService: LoadingScreenService) {
  }
  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date(2016, 1, 1);
    this.basesrv.getPatients(data => {
      this.myOptions = this.xmltosrv.prepareXMLofPatients(data);
    });
    this.basesrv.getDepartment(data =>{
      this.department = this.xmltosrv.prepareXMLofDepartment(data);
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ProtocolModalComponent, {
      width: '70%',
      height: '70%',
      data: {name: 'l', animal: 'ttt'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  Submit() {
    // this.router.navigate(['nav']);
    this.loadingScreenService.startLoading();
    this.router.navigate(['nav/admission']);
    this.loadingScreenService.stopLoading();
    localStorage.clear();
    const request = new DataRequest();
    if (this.selectedBase === '1') {
      request.type = 1;
    } else if (this.selectedBase === '2') {
      request.type = 0;
    }
    request.patientsList = this.optionsModel;
    request.startDate = this.fromDate;
    request.endDate = this.toDate;
    request.stage = 'followUp' ; // The first stage you want to see
    this.mainRequest = request;
    this.sharedR.changeRequest(request);
    this.serched = false;


    // send the request to the other pages
    // this.basesrv.getCompliance(request, data => {
    //   const plan = this.xmltosrv.prepareXMLofCompliance(data);
    //   console.log(plan);
    // });
    // this.basesrv.getSubPlanes(data => {
    //   const result = this.xmltosrv.prepareXMLofSubPlans(data);
    //   console.log(result);
    // });
    // this.basesrv.getKnowledge(data => {
    //   const plan = this.xmltosrv.prepareXMLofKnowledge(data);
    //   console.log(plan);
    // });
    // this.basesrv.getData(request, data => {
    //   console.log(this.xmltosrv.prepareXMLofDATA(data));
    // });
  }
}
