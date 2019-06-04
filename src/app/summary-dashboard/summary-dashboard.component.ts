import {Component, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';
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

@Component({
  selector: 'app-summary-dashboard',
  templateUrl: './summary-dashboard.component.html',
  styleUrls: ['./summary-dashboard.component.css']
})
export class SummaryDashboardComponent implements OnInit{


  public pageError = false;
  public mainRequest: DataRequest;
  public checked = false;
  public mainPlan;
  title = 'app';
  public showIntervals = false;
  public colorsCompliance = [ {backgroundColor: ['#01b300', '#ed1d04']}];
  public colorsConcepts = [ {backgroundColor: ['#51bcc2', '#d1a4c6', '#87cf78', '#d3a93e',
      '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e']}];
  public sumCompliance: PieChartData;
  public sumConcepts: BarChartData;
  public tempPlan;
  public tempRequest;
  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService,   private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService,     private loadingScreenService: LoadingScreenService) {
    this.loadingScreenService.startLoading();
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'Summary';
    if (localStorage.getItem('summary') !== null) {
      const data = JSON.parse(localStorage.getItem('summary'));
      this.sumCompliance = this.objToChart.createPieChart(data.score);
      // show every stage score
      this.mainPlan = data.subPlans;
      this.sumConcepts = this.objToChart.createBarChart(data.subPlans, this.mainRequest);
    } else {
    this.basesrv.getKnowledge(data => {
      const totalscore = [];
      this.mainPlan = this.xmltosrv.prepareXMLofKnowledge(data);
      for (let k = 0; k < this.mainPlan.length; k++) {
        if (localStorage.getItem(this.mainPlan[k].name) !== null) {
          totalscore.push({'name': this.mainPlan[k].name, 'weight': this.mainPlan[k].weight,
            'score': (JSON.parse(localStorage.getItem(this.mainPlan[k].name)).score )});
        } else {
          // this.tempRequest = this.mainRequest;
          // this.tempRequest.stage = this.mainPlan[k].name;
          // this.basesrv.getCompliance(this.tempRequest, data1 => {
          //   this.tempPlan = this.xmltosrv.prepareXMLofCompliance(data1);
          //   if(this.tempPlan.score == -1) {
          //     localStorage.setItem(this.tempPlan.name, 'no dada');
          //     this.pageError = true;
          //   } else {
          //     localStorage.setItem(this.te, JSON.stringify(this.tempPlan));
          //     this.checked = false;
          //     totalscore.push({'name': this.tempPlan.name, 'weight': this.tempPlan.weight,
          //       'score': (JSON.parse(localStorage.getItem(this.tempPlan.name)).score )});
          //   }
          // });
        }
      }
      // calc total score
      let sum = 0;
      for (let g = 0; g < totalscore.length; g++) {
        sum = sum + totalscore[g].weight * totalscore[g].score;
      }
      localStorage.setItem('summary', JSON.stringify({name: 'summary', score: sum, subPlans: totalscore}));
      this.sumCompliance = this.objToChart.createPieChart(sum);
      // show every stage score
      this.sumConcepts = this.objToChart.createBarChart(totalscore, this.mainRequest);
      // save in local storage
    });
    }
    console.log(this.mainPlan);

  }
  callback(data){
    // get the stage and
    // this.loadscreenService.stopLoading();
    this.mainPlan = this.xmltosrv.prepareXMLofCompliance(data);
    if(this.mainPlan.score == -1){
      this.pageError = true;
      localStorage.setItem('followUp', 'no data');
    } else {
      localStorage.setItem('followUp', JSON.stringify(this.mainPlan));
      console.log(this.mainPlan);
      this.checked = false;
      // create pie chart
      // this.followUpCompliance = this.objToChart.createPieChart(this.mainPlan.score);
      // create bar chart
      // this.createBar(this.mainPlan.subPlans);
      // this.followUpConcepts = this.objToChart.createBarChart(this.mainPlan.subPlans, this.mainRequest);
    }

    // totalscore.push({'name': this.mainPlan[k].name, 'weight': this.mainPlan[k].weight,
    //   'score': (JSON.parse(localStorage.getItem(this.mainPlan[k].name)).score )});
  }
  ngOnInit(): void {
    this.loadingScreenService.stopLoading();

  }
}

