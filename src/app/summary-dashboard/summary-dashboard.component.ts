import {Component, OnInit} from '@angular/core';
import {map, timeout} from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import {DataRequest} from '../models/dataRequest';
import {Plan} from '../models/plan';
import {PieChartData} from '../models/pieChartData';
import {BarChartData} from '../models/barChartData';
import {AdmissionDashboardService} from '../admission-dashboard/admission-dashboard.service';
import {BaseServiceService} from '../services/baseService.service';
import {ActivatedRoute, Router} from '@angular/router';
import {XmlToObjectService} from '../services/xml-to-object.service';
import {SharedRequestService} from '../services/shared-request.service';
import {ObjectToChartService} from '../services/object-to-chart.service';
import {LoadingScreenService} from '../services/loading-screen.service';
import {Subscription} from 'rxjs';
import {LogObject} from '../models/logObject';

@Component({
  selector: 'app-summary-dashboard',
  templateUrl: './summary-dashboard.component.html',
  styleUrls: ['./summary-dashboard.component.css']
})
export class SummaryDashboardComponent implements OnInit{

  private username: string;
  sub: Subscription;
  public stageNoData = [];
  public pageError = false;
  public mainRequest: DataRequest;
  public mainPlan;
  title = 'app';
  public showIntervals = false;
  public colorsCompliance = [ {backgroundColor: ['#01b300', '#ed1d04']}];
  public colorsConcepts = [ {backgroundColor: ['#51bcc2', '#d1a4c6', '#87cf78', '#d3a93e', '#cf5800',
      '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e']}];
  public sumCompliance: PieChartData;
  public sumConcepts: BarChartData;
  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService,   private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService,     private loadingScreenService: LoadingScreenService) {
    this.sub = this.router.events.subscribe((e: any) => {
    this.stageNoData = [];
    this.pageError = false;
      this.loadingScreenService.startLoading();
      this.init();
    });
    this.route.queryParams.subscribe(params => {
      this.username = params.user;
    });
    const stageLog = new LogObject();
    stageLog.conceptId = '00';
    stageLog.patiendID = this.username;
    stageLog.method = 'HERTZFELDBI';
    stageLog.state = 'Click on Stage';
    stageLog.description = 'Summary';
    this.basesrv.writeLog(stageLog, function () {
      console.log('log stage success');
    });
  }
  init(){
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'Summary';
    this.basesrv.getKnowledge(data => {
      let sum = 0;
      const totalscore = [];
      this.stageNoData = [];
      this.mainPlan = this.xmltosrv.prepareXMLofKnowledge(data);
      for (let k = 0; k < this.mainPlan.length; k++) {
        if (localStorage.getItem(this.mainPlan[k].name) !== null) {
          if(localStorage.getItem(this.mainPlan[k].name) === 'no data'){
            totalscore.push({'name': this.mainPlan[k].name, 'weight': this.mainPlan[k].weight,
              'score': 0});
            sum = sum + parseFloat(this.mainPlan[k].weight);
            this.stageNoData.push(this.mainPlan[k].name);
          } else {
            totalscore.push({'name': this.mainPlan[k].name, 'weight': this.mainPlan[k].weight,
              'score': (JSON.parse(localStorage.getItem(this.mainPlan[k].name)).score )});
            sum = sum + this.mainPlan[k].weight * parseFloat((JSON.parse(localStorage.getItem(this.mainPlan[k].name)).score ));
          }
          if (totalscore.length === 5) {
            if(this.stageNoData.length === 5){
              this.pageError = true;
              this.loadingScreenService.stopLoading();
            } else {
              localStorage.setItem('summary', JSON.stringify({name: 'summary', score: sum, subPlans: totalscore}));
              this.sumCompliance = this.objToChart.createPieChart(sum);
              this.sumConcepts = this.objToChart.createBarChart(totalscore, this.mainRequest);
              this.loadingScreenService.stopLoading();
            }
          }
        } else {
          const tempRequest = this.mainRequest;
          tempRequest.stage = this.mainPlan[k].name;
          this.basesrv.getCompliance(tempRequest, data1 => {
            const tempPlan = this.xmltosrv.prepareXMLofCompliance(data1);
            if (tempPlan.score == -1) {
              localStorage.setItem(tempPlan.name, 'no data');
              this.pageError = true;
            } else {
              localStorage.setItem(tempPlan.name, JSON.stringify(tempPlan));
              const newOne = {
                'name': tempPlan.name, 'weight': tempPlan.weight,
                'score': (JSON.parse(localStorage.getItem(tempPlan.name)).score)
              };
              totalscore.push(newOne);
              sum = sum + newOne.weight * newOne.score;
            }
            if (totalscore.length === 5) {
              if(this.stageNoData.length === 5){
                this.pageError = true;
                this.loadingScreenService.stopLoading();
              } else {
                localStorage.setItem('summary', JSON.stringify({name: 'summary', score: sum, subPlans: totalscore}));
                this.sumCompliance = this.objToChart.createPieChart(sum);
                this.sumConcepts = this.objToChart.createBarChart(totalscore, this.mainRequest);
                this.loadingScreenService.stopLoading();
              }
            }
          });
          // setTimeout(4200);
        }
      }
    });
    console.log(this.mainPlan);
  }
  ngOnInit(): void {
     this.init();
  }
}

