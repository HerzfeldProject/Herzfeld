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
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
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

  userError = false;
  errorText = '';
  departmentAndPatients = [];
  selectedDepartment: string[] = [];
  mainRequest: DataRequest;
  public serched = true;
  fromDate: Date;
  toDate: Date;
  selectedBase: string;
  optionsModel: string[] = [];
  patients: NodeList = null;
  department: IMultiSelectOption[]  = [];
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
  constructor(private valService: BaseServiceService,    private router: Router, private route: ActivatedRoute,
              private _http: HttpClient, private dialog: MatDialog,  private basesrv: BaseServiceService,
              private xmltosrv: XmlToObjectService, private sharedR: SharedRequestService,
              private loadingScreenService: LoadingScreenService) {
  }
  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date(2016, 1, 1);
    this.basesrv.getDepartment(data => {
      this.departmentAndPatients = this.xmltosrv.prepareXMLofDepartmentWithPatints(data);
      this.department = this.xmltosrv.prepareXMLofDepartment(this.departmentAndPatients);
      this.basesrv.getPatients(data1 => {
        this.myOptions = this.xmltosrv.prepareXMLofPatients(data1);
        this.loadingScreenService.stopLoading();
      });
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
  changeDepartment(event){
    this.optionsModel = [];
    if(event.length !== 0) {
      for (let i = 0; i < this.departmentAndPatients.length; i++) {
        for (let k = 0; k < event.length; k++) {
          if (event[k] === this.departmentAndPatients[i].dep) {
            if(! this.optionsModel.includes(this.departmentAndPatients[i].patients)) {
              this.optionsModel.push(this.departmentAndPatients[i].patients);
            }
          }
        }
      }
    } else {
      while (this.optionsModel.length > 0) {
        this.optionsModel.pop();
      }
    }
  }
  changePatients(event) {
    if(event.length === 0) {
      while (this.selectedDepartment.length > 0) {
        this.selectedDepartment.pop();
      }
    }
  }
  Submit() {

    if (this.selectedBase === undefined) {
      this.userError = true;
      this.errorText = 'You need to Pick Time Base/ Patients Base';
    } else if (this.fromDate > this.toDate) {
      this.userError = true;
      this.errorText = 'Start Date Cant Be After End Date';
    } else if (this.optionsModel.length === 0) {
      this.userError = true;
      this.errorText = 'Cant Submit without patients';
    } else {
      this.userError = false;
        this.loadingScreenService.startLoading();
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
        this.router.navigate(['nav/admission'], {queryParams: {title: this.mainRequest, si: true}});
      }

    }
}
