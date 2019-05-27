import {Component, OnInit, AfterViewInit, Input, ViewChild, Output} from '@angular/core';
import { Chart } from 'chart.js';
import {PieChartData} from '../models/pieChartData';
import {AdmissionDashboardService} from './admission-dashboard.service';
import {BarChartData} from '../models/barChartData';
import {Weights} from '../models/weights';
import {BaseServiceService} from '../services/baseService.service';
import {ActivatedRoute, Router} from '@angular/router';
import {XmlToObjectService} from '../services/xml-to-object.service';
import {DataRequest} from '../models/dataRequest';
import {SharedRequestService} from '../services/shared-request.service';
import {Plan} from '../models/plan';
import {ObjectToChartService} from '../services/object-to-chart.service';
import {LoadingScreenService} from '../services/loading-screen.service';

@Component({
  // selector: 'app-followup/admission-dashboard',
  templateUrl: './admission-dashboard.component.html',
  styleUrls: ['./admission-dashboard.component.css'],
  providers: [BaseServiceService, ObjectToChartService]
})
export class AdmissionDashboardComponent implements OnInit, AfterViewInit {

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
  public colorsCompliance = [{backgroundColor: ['#01b300', '#ed1d04']}];
  public colorsConcepts = [{backgroundColor: ['#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2']}];
  public admissionCompliance: PieChartData;
  public admissionConcepts: BarChartData;

  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService, private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService, private loadingScreenService: LoadingScreenService) {
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'admission';
    // followUpAndPrevention, followUpAndPreventionAndTreatment
    if (localStorage.getItem('admission') !== null) {
      if(localStorage.getItem('admission') == 'no data'){
        this.pageError = true;
      } else {
        this.mainPlan = JSON.parse(localStorage.getItem('admission'));
        console.log(this.mainPlan);
        this.checked = false;
        // create pie chart
        this.admissionCompliance = this.objToChart.createPieChart(this.mainPlan.score);
        // create bar chart
        this.createBar(this.mainPlan.subPlans);
      }
    } else {
      this.basesrv.getCompliance(this.mainRequest, this.callback.bind(this));
    }
  }
  createBar(subPlans) {
    this.tempSubPlans = subPlans;
    // const ctx = (<HTMLCanvasElement> document.getElementById('myChart'));
    // const canvas = ctx.getContext('2d');
    // canvas.clearRect(0, 0, ctx.width, ctx.height);
    this.admissionConcepts = new BarChartData();
    this.admissionConcepts.datasets = [{data: [], label: 'Completion percentages', metadata: [],
      backgroundColor: ['#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2']}, {label: 'line', data: [], type: 'line'}];
    this.admissionConcepts.labels = [];
    for (let i = 0; i < subPlans.length; i++) {
      this.admissionConcepts.labels.push(subPlans[i].name);
      this.admissionConcepts.datasets[0].data.push(subPlans[i].score);
      this.admissionConcepts.datasets[1].data.push(subPlans[i].score);
      // admissionConcepts.datasets[0].metadata.push(subPlans[i].conceptId);
    }
    this.admissionConcepts.options = {
      onClick: this.onDrillDown.bind(this),
      responsive: true,
      scaleShowVerticalLines: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
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
        labels: this.admissionConcepts.labels,
        datasets: this.admissionConcepts.datasets,
      },
      options: this.admissionConcepts.options
    });
    father.appendChild(canvas);

  }
  onDrillDown(c, i) {
    this.levels.push(this.tempSubPlans);
    if(this.levelOfDrillDown == 0){
      this.detailText = '';
    }
    this.levelOfDrillDown ++;
    const conceptName = i[0]._model.label;
    let sub = [];
    for(let i = 0; i < this.tempSubPlans.length; i++){
      if(this.tempSubPlans[i].name == conceptName){
        this.detailText = this.detailText + conceptName ;
        sub = this.tempSubPlans[i].subPlans;
        if(this.tempSubPlans[i].score !== undefined){
          this.detailText = this.detailText + '-'+ Number(this.tempSubPlans[i].score).toFixed(2);
        }
        this.detailText = this.detailText + ' --> ';
      }

    }
    this.createBar(sub);
  }
  onDrillUp(){
    this.levelOfDrillDown --;
    const lastArrow = this.detailText.lastIndexOf('-->');
    const oneBefore = this.detailText.substring(0, lastArrow).lastIndexOf('-->');
    this.detailText = this.detailText.substring(0, oneBefore + 3);
    this.createBar(this.levels.pop());
  }

  callback(data){
    this.loadingScreenService.stopLoading()
    this.mainPlan = this.xmltosrv.prepareXMLofCompliance(data);
    if(this.mainPlan.score == -1) {
      localStorage.setItem('admission', 'no dada');
      this.pageError = true;
    } else {
      localStorage.setItem('admission', JSON.stringify(this.mainPlan));
      console.log(this.mainPlan);
      this.checked = false;
      // create pie chart
      this.admissionCompliance = this.objToChart.createPieChart(this.mainPlan.score);
      // create bar chart
      this.createBar(this.mainPlan.subPlans);
      // this.objToChart.createBarChart(this.mainPlan.subPlans, this.mainRequest);
    }
  }
  ngAfterViewInit() {
    Chart.pluginService.register({
      afterDraw: function (chart) {
        if (chart.config.options.elements.center) {
          const helpers = Chart.helpers;
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          const ctx = chart.chart.ctx;
          ctx.save();
          const fontSize = helpers.getValueOrDefault(chart.config.options.elements.center.fontSize,
            Chart.defaults.global.defaultFontSize);
          const fontStyle = helpers.getValueOrDefault(chart.config.options.elements.center.fontStyle,
            Chart.defaults.global.defaultFontStyle);
          const fontFamily = helpers.getValueOrDefault(chart.config.options.elements.center.fontFamily,
            Chart.defaults.global.defaultFontFamily);
          const font = helpers.fontString(fontSize, fontStyle, fontFamily);
          ctx.font = font;
          ctx.fillStyle = helpers.getValueOrDefault(chart.config.options.elements.center.fontColor, Chart.defaults.global.defaultFontColor);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(chart.config.options.elements.center.text, centerX, centerY);
          ctx.restore();
        }
      },
    });
  }

  ngOnInit() {
  }
}
