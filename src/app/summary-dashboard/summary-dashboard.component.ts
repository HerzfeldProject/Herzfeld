import { Component } from '@angular/core';
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

@Component({
  selector: 'app-summary-dashboard',
  templateUrl: './summary-dashboard.component.html',
  styleUrls: ['./summary-dashboard.component.css']
})
export class SummaryDashboardComponent {


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

  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService,   private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService) {
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
        } // if dont exist need to do getCompliance
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
}

