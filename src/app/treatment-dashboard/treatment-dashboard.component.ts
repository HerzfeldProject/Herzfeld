import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import {DataRequest} from '../models/dataRequest';
import {Plan} from '../models/plan';
import {PieChartData} from '../models/pieChartData';
import {BarChartData} from '../models/barChartData';
import {AdmissionDashboardService} from '../admission-dashboard/admission-dashboard.service';
import {BaseServiceService} from '../services/baseService.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {XmlToObjectService} from '../services/xml-to-object.service';
import {SharedRequestService} from '../services/shared-request.service';
import {ObjectToChartService} from '../services/object-to-chart.service';
import {Chart} from 'chart.js';
import {LoadingScreenService} from '../services/loading-screen.service';
import {SharedService} from '../services/shared.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-treatment-dashboard',
  templateUrl: './treatment-dashboard.component.html',
  styleUrls: ['./treatment-dashboard.component.css']
})
export class TreatmentDashboardComponent implements OnInit, AfterViewInit, OnDestroy{

  sub: Subscription;
  disableTimeline = false;
  sameChart = false;
  selectedPlan: Plan;
  modeTimeline = true;
  public endDrill = false;
  public detailText = '';
  public tempSubPlans = [];
  public levels = [];
  public levelOfDrillDown = 0;
  public pageError = false;
  public mainRequest: DataRequest;
  public checked = false;
// weights = Weights;
  public mainPlan = new Plan();
  title = 'app';
  public showIntervals = false;
  public colorsCompliance = [ {backgroundColor: ['#01b300', '#ed1d04']}];
  public colorsConcepts = [ {backgroundColor: ['#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e']}];
  public treatCompliance: PieChartData;
  public treatConcepts: BarChartData;

  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService, private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService,
              private loadingScreenService: LoadingScreenService, private sharedsrv: SharedService) {
    this.sub = this.router.events.subscribe((e: any) => {
      this.loadingScreenService.startLoading();
      this.sameChart = false;
      this.modeTimeline = true;
      this.endDrill = false;
      this.detailText = '';
      this.tempSubPlans = [];
      this.levels = [];
      this.levelOfDrillDown = 0;
      document.getElementById('moreDetails').innerHTML = '';
      if (e instanceof NavigationEnd) {
        this.treatCompliance = null;
        this.ngOnInit();
      }
    });
  }
  createBar(subPlans) {
    this.tempSubPlans = subPlans;
    this.treatConcepts = new BarChartData();
    this.treatConcepts.datasets = [{data: [], label: 'Completion percentages', metadata: [],
      backgroundColor: []}];
    this.treatConcepts.labels = [];
    for (let i = 0; i < subPlans.length; i++) {
      this.treatConcepts.labels.push(subPlans[i].name);
      this.treatConcepts.datasets[0].data.push(subPlans[i].score);
      this.treatConcepts.datasets[0].metadata.push(subPlans[i]);
      if(subPlans[i].subPlans.length > 1){
        this.treatConcepts.datasets[0].backgroundColor.push('#6b521d');
      } else {
        this.treatConcepts.datasets[0].backgroundColor.push('#e9bd43');
      }
    }
    this.treatConcepts.options = {
      tooltips: {
        enabled: false,
        custom: this.sharedsrv.histogToolTip
      },
      onClick: this.onDrillDown.bind(this),
      responsive: true,
      scaleShowVerticalLines: false,
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          }
        }
        ],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 1,
          }
        }]
      },
    };
    const father = document.getElementById('barDiv');
    father.innerHTML = '';
    const canvas = <HTMLCanvasElement>document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.treatConcepts.labels,
        datasets: this.treatConcepts.datasets,
      },
      options: this.treatConcepts.options
    });
    father.appendChild(canvas);
  }

  onDrillDown(c, i) {
    if(!this.sameChart) {
      if (this.endDrill) {
        const lastArrow = this.detailText.lastIndexOf('<i class="fa fa-arrow-right"></i>');
        const oneBefore = this.detailText.substring(0, lastArrow).lastIndexOf('<i class="fa fa-arrow-right"></i>');
        this.detailText = this.detailText.substring(0, oneBefore + 33);
      }
      this.levels.push(this.tempSubPlans);
      if (this.levelOfDrillDown == 0) {
        this.detailText = '';
      }
    } else {
      this.levels.push(this.tempSubPlans);
      this.detailText = this.detailText.substring(0, this.detailText.lastIndexOf('<button'));
    }
    const conceptName = i[0]._model.label;
    let sub = [];
    let textToAdd = '';
    for (let i = 0; i < this.tempSubPlans.length; i++) {
      if (this.tempSubPlans[i].name == conceptName) {
        textToAdd = conceptName ;
        sub = this.tempSubPlans[i].subPlans;
        this.levelOfDrillDown++;
        if (this.tempSubPlans[i].score !== undefined) {
          this.endDrill = false;
          textToAdd = textToAdd + ' - ' + Number(this.tempSubPlans[i].score).toFixed(2);
        }
        if (this.tempSubPlans[i].conceptId !== undefined) {
          textToAdd = '<button title="Show Time Intervals" (click)="' +
            this.onConceptInterval( conceptName , this.tempSubPlans[i]) + '">' + textToAdd + '</button>';
        } else {
          this.onConceptInterval( conceptName , this.tempSubPlans[i]);
        }
        textToAdd = textToAdd + '<i class="fa fa-arrow-right"></i> ';
        this.detailText = this.detailText + textToAdd;
        break;
      }
    }
    document.getElementById('moreDetails').innerHTML = this.detailText;
    if (sub[0].score !== undefined) {
      this.createBar(sub);
      this.sameChart = false;
    } else {
      this.endDrill = true;
      this.sameChart = true;
    }
  }
  onDrillUp(){
    this.levelOfDrillDown --;
    if (this.levelOfDrillDown === 0) {
      this.endDrill = false;
      this.detailText = '';
    }    else {
      const lastArrow = this.detailText.lastIndexOf('<i class="fa fa-arrow-right"></i>');
      const oneBefore = this.detailText.substring(0, lastArrow).lastIndexOf('<i class="fa fa-arrow-right"></i>');
      this.detailText = this.detailText.substring(0, oneBefore + 33);
    }
    document.getElementById('moreDetails').innerHTML = this.detailText;
    const temp = this.levels.pop();
    this.createBar(temp);
  }

  callback(data){
    this.mainPlan = this.xmltosrv.prepareXMLofCompliance(data);
    if(this.mainPlan.score == -1) {
      localStorage.setItem('Followup, Prevention and Treatment', 'no data');
      this.pageError = true;
    } else {
      localStorage.setItem('Followup, Prevention and Treatment', JSON.stringify(this.mainPlan));
      console.log(this.mainPlan);
      this.checked = false;
      // create pie chart
      this.treatCompliance = this.objToChart.createPieChart(this.mainPlan.score);
      // create bar chart
      this.createBar(this.mainPlan.subPlans);
    }
    this.loadingScreenService.stopLoading();
  }
  onConceptInterval(name, plan) {
    document.getElementById('timelinediv').hidden = false;
    this.loadingScreenService.startLoading();
    this.selectedPlan = plan;
    document.getElementById('timeline').innerHTML = '';
    ///
    const child = document.getElementById('intervalsPatients');
    child.innerHTML = '';
    const titleOfIntervales = document.createElement('h5');
    titleOfIntervales.style.color = '#0071c5';
    titleOfIntervales.style.fontSize = '20px';
    let text = name + ' Compliance <br><br>';
    text = text + 'Start date: ' + this.mainRequest.startDate.toDateString() + '<br><br>';
    text = text + 'End date:' + this.mainRequest.endDate.toDateString() +  '<br><br>';
    titleOfIntervales.innerHTML = text;
    document.getElementById('intervalsPatients').appendChild(titleOfIntervales);
    ///
    if(plan.conceptId === undefined){
      this.modeTimeline = false;
      this.disableTimeline = true;
      document.getElementById('timeline').hidden = true;
      document.getElementById('timelinediv').hidden = true;
      this.loadingScreenService.stopLoading();
    } else {
      this.disableTimeline = false;
      this.basesrv.getData(this.mainRequest, plan.conceptId, data => {
        const temp = this.xmltosrv.prepareXMLofDATA(data);
        const relevant = this.xmltosrv.createDataInstances(temp, this.mainRequest.startDate, this.mainRequest.endDate);
        // relevant = this.xmltosrv.combinIntervals(relevant);

        if (relevant.length === 0) {
          const empty = document.createElement('h2');
          empty.textContent = ' no intervals data for ' + name;
          empty.style.height = '200px';
          document.getElementById('timelinediv').appendChild(empty);
          document.getElementById('timelinediv').hidden = true;


        } else {
          const intexp = document.createElement('h4');
          intexp.textContent = this.sharedsrv.intervalExplanation(this.selectedPlan.icons[0]);
          document.getElementById('timeline').appendChild(intexp);
          google.charts.load('current', {'packages': ['corechart', 'timeline']});
          google.charts.setOnLoadCallback(this.sharedsrv.drawTimeLine.bind(relevant));
        }
        this.loadingScreenService.stopLoading();
        document.getElementById('timeline').hidden = true;
        this.modeTimeline = false;
      });
    }

  }
  ngAfterViewInit() {
    this.sharedsrv.afterView();
  }
  public changeTime(isTime) {
    this.modeTimeline = isTime;
    if (!this.modeTimeline) {
      document.getElementById('timelinediv').hidden = true;
      document.getElementById('timeline').hidden = true;
      document.getElementById('timelinediv').style.width = '100%';
    } else {
      document.getElementById('timelinediv').hidden = false;
      document.getElementById('timeline').hidden = false;
    }
  }
  ngOnInit() {
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'Followup, Prevention and Treatment';
    this.basesrv.getCompliance(this.mainRequest, this.callback.bind(this));
    document.getElementById('barDiv').innerHTML = '';

  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }  }
}
