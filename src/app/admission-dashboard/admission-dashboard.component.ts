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
  public colorsCompliance = [{backgroundColor: ['#01b300', '#ed1d04']}];
  public colorsConcepts = [{backgroundColor: ['#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2']}];
  public admissionCompliance: PieChartData;
  public admissionConcepts: BarChartData;

  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService, private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService,
              private loadingScreenService: LoadingScreenService) {
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'Admission';
    // if (localStorage.getItem('Admission') !== null) {
    //   this.loadingScreenService.stopLoading()
    //   if(localStorage.getItem('Admission') == 'no data'){
    //     this.pageError = true;
    //   } else {
    //     this.mainPlan = JSON.parse(localStorage.getItem('Admission'));
    //     console.log(this.mainPlan);
    //     this.checked = false;
    //     // create pie chart
    //     this.admissionCompliance = this.objToChart.createPieChart(this.mainPlan.score);
    //     // create bar chart
    //      this.createBar(this.mainPlan.subPlans);
    //   }
    // } else {
      this.basesrv.getCompliance(this.mainRequest, this.callback.bind(this));
    // }
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
    if (this.endDrill) {
      const lastArrow = this.detailText.lastIndexOf('<i class="fa fa-arrow-right"></i>');
      const oneBefore = this.detailText.substring(0, lastArrow).lastIndexOf('<i class="fa fa-arrow-right"></i>');
      this.detailText = this.detailText.substring(0, oneBefore + 33);
    }
    this.levels.push(this.tempSubPlans);
    if (this.levelOfDrillDown == 0) {
      this.detailText = '';
    }
    this.levelOfDrillDown ++;
    const conceptName = i[0]._model.label;
    let sub = [];
    let textToAdd = '';
    for (let i = 0; i < this.tempSubPlans.length; i++) {
      if (this.tempSubPlans[i].name == conceptName) {
        textToAdd = conceptName ;
        sub = this.tempSubPlans[i].subPlans;
        if (this.tempSubPlans[i].score !== undefined) {
          this.endDrill = false;
          textToAdd = textToAdd + ' - ' + Number(this.tempSubPlans[i].score).toFixed(2);
        }
        if (this.tempSubPlans[i].conceptId !== undefined) {
          textToAdd = '<button title="Show Time Intervals" (click)="' +
            this.onConceptInterval( conceptName , this.tempSubPlans[i].conceptId) + '">' + textToAdd + '</button>';
        }
        textToAdd = textToAdd + '<i class="fa fa-arrow-right"></i> ';
        this.detailText = this.detailText + textToAdd;
        break;
      }
    }
    document.getElementById('moreDetails').innerHTML = this.detailText;
    if (sub[0].score !== undefined) {
      this.createBar(sub);
    } else {      this.endDrill = true;
    }
  }
  onDrillUp(){
    this.levelOfDrillDown --;
    if (this.levelOfDrillDown === 0) {
      this.detailText = '';
      // } else if (this.levelOfDrillDown === 1) {
      //   const oneBefore = this.detailText.lastIndexOf('<i class="fa fa-arrow-right"></i>');
      //   this.detailText = this.detailText.substring(0, oneBefore + 33);
    }    else {
      const lastArrow = this.detailText.lastIndexOf('<i class="fa fa-arrow-right"></i>');
      const oneBefore = this.detailText.substring(0, lastArrow).lastIndexOf('<i class="fa fa-arrow-right"></i>');
      this.detailText = this.detailText.substring(0, oneBefore + 33);
    }
    document.getElementById('moreDetails').innerHTML = this.detailText;
    this.createBar(this.levels.pop());
  }

  callback(data){
    this.loadingScreenService.stopLoading();
    this.mainPlan = this.xmltosrv.prepareXMLofCompliance(data);
    if(this.mainPlan.score == -1) {
      localStorage.setItem('Admission', 'no dada');
      this.pageError = true;
    } else {
      localStorage.setItem('Admission', JSON.stringify(this.mainPlan));
      console.log(this.mainPlan);
      this.checked = false;
      // create pie chart
      this.admissionCompliance = this.objToChart.createPieChart(this.mainPlan.score);
      // create bar chart
      this.createBar(this.mainPlan.subPlans);
      // this.objToChart.createBarChart(this.mainPlan.subPlans, this.mainRequest);
    }
  }
  onConceptInterval(name, id) {

    const child = document.getElementById('intervalsPatients');
    const len = child.childNodes.length;
    if (len > 0) {
      for (let j = 0; j < len; j++) {
        child.removeChild(child.childNodes[j]);
      }
    }
    this.basesrv.getData(this.mainRequest, id, data => {
      const temp = this.xmltosrv.prepareXMLofDATA(data);
      const relevant = this.xmltosrv.createDataInstances(temp, this.mainRequest.startDate, this.mainRequest.endDate);

      if (relevant.length === 0) {
        const empty = document.createElement('h2');
        empty.textContent = 'no data for ' + name;
        document.getElementById('timelinediv').appendChild(empty);

      } else {
        ////////////////////////
        // calculateIntervalesForAllPatients
        google.charts.load('current', {'packages': ['corechart', 'timeline']});
        google.charts.setOnLoadCallback(drawTimeLine.bind(relevant));

        const titleOfIntervales = document.createElement('h5');
        titleOfIntervales.style.color = '#0071c5';
        titleOfIntervales.style.fontSize = '20px';
        let text = name + ' Compliance of Patients: ' + this.mainRequest.patientsList + '<br><br>';
        text = text + 'Start date: ' + this.mainRequest.startDate.toDateString() + '<br><br>';
        text = text + 'End date:' + this.mainRequest.endDate.toDateString() +  '<br><br>';
        titleOfIntervales.innerHTML = text;
        document.getElementById('intervalsPatients').appendChild(titleOfIntervales);
        document.getElementById('intervalesDashboard').focus();
      }
    });
    function drawTimeLine(relevant) {
      const container = document.getElementById('timelinediv');
      const chart = new google.visualization.Timeline(container);
      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn({type: 'string', id: 'value'});
      dataTable.addColumn({type: 'date', id: 'Start'});
      dataTable.addColumn({type: 'date', id: 'End'});
      // dataTable.addColumn({type: 'string', role: 'tooltip'});
      dataTable.addRows([]);


      // add option of number patients - combain
      for (let i = 0; i < this.length; i++) {
        let num = this[i].value;
        if (num.includes('.')) {
          num = Number(num).toFixed(1);
          if (num.includes('.0')) {
            num = num.substring(0, 1);
          }
        }
        dataTable.addRow([num, new Date(this[i].startTime), new Date(this[i].endTime)]); // , 'patients id\'s: ' + this[i].entityId ]);
      }
      const options = {
        height: 40 + (dataTable.getNumberOfRows() * 40),
        avoidOverlappingGridLines: true,
        tooltip: {isHtml: true}
      };
      chart.draw(dataTable, options);
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
