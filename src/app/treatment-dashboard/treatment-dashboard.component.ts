import {AfterViewInit, Component, OnInit} from '@angular/core';
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
import {Chart} from 'chart.js';

@Component({
  selector: 'app-treatment-dashboard',
  templateUrl: './treatment-dashboard.component.html',
  styleUrls: ['./treatment-dashboard.component.css']
})
export class TreatmentDashboardComponent implements OnInit, AfterViewInit{

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

  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService,   private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService) {
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'Followup, Prevention and Treatment';
    // followUpAndPrevention, followUpAndPreventionAndTreatment
    // if(localStorage.getItem('Followup, Prevention and Treatment') !== null) {
    //   if(localStorage.getItem('Followup, Prevention and Treatment') == 'no data'){
    //     this.pageError = true;
    //   } else {
    //     this.mainPlan = JSON.parse(localStorage.getItem('Followup, Prevention and Treatment'));
    //     this.checked = false;
    //     // create pie chart
    //     this.treatCompliance = this.objToChart.createPieChart(this.mainPlan.score);
    //     // create bar chart
    //     this.treatConcepts = this.objToChart.createBarChart(this.mainPlan.subPlans, this.mainRequest);
    //   }
    // } else {
      this.basesrv.getCompliance(this.mainRequest, data => {
        this.mainPlan = this.xmltosrv.prepareXMLofCompliance(data);
        if(this.mainPlan.score == -1) {
          localStorage.setItem('Followup, Prevention and Treatment', 'no data')
          this.pageError = true;
        } else {
          localStorage.setItem('Followup, Prevention and Treatment', JSON.stringify(this.mainPlan));
          this.checked = false;
          // create pie chart
          this.treatCompliance = this.objToChart.createPieChart(this.mainPlan.score);
          // create bar chart
          this.createBar(this.mainPlan.subPlans);
        }
      });
    //}
    console.log(this.mainPlan);
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
  ngOnInit() {  }
  createBar(subPlans) {
    const father = document.getElementById('barDiv');
    if(father !== null){
      father.innerHTML = '';}
    const canvas = <HTMLCanvasElement>document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    this.tempSubPlans = subPlans;
    this.treatConcepts = new BarChartData();
    this.treatConcepts.datasets = [{data: [], label: 'Completion percentages', metadata: [],
      backgroundColor: ['#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e', '#d3a93e','#d3a93e','#d3a93e','#d3a93e','#d3a93e']}];
    this.treatConcepts.labels = [];
    for (let i = 0; i < subPlans.length; i++) {
      this.treatConcepts.labels.push(subPlans[i].name);
      this.treatConcepts.datasets[0].data.push(subPlans[i].score);
    }
    this.treatConcepts.options = {
      events: ['mousemove', 'click'], // this is needed, otherwise onHover is not fired
      onHover: (event, chartElement) => {
        event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      },
      onClick: this.onDrillDown.bind(this),
      responsive: true,
      scaleShowVerticalLines: false,
      scales: {
        yAxes: [{
          stacked: false,
          ticks: {
            beginAtZero: true
          }
        }]
      },
    };

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
  onDrillUp() {
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
    // function drawChart() {
    //   var data = new google.visualization.DataTable();
    //   data.addColumn('date', 'Date');
    //   data.addColumn('number', 'Sold Pencils');
    //   data.addColumn('string', 'title1');
    //   data.addColumn('string', 'text1');
    //   data.addRows([
    //     [new Date(2008, 1 ,1), 30000, undefined, undefined],
    //     [new Date(2008, 1 ,2), 14045, undefined, undefined],
    //     [new Date(2008, 1 ,3), 55022, undefined, undefined],
    //     [new Date(2008, 1 ,4), 75284, undefined, undefined],
    //     [new Date(2008, 1 ,5), 41476, 'Bought Pens','Bought 200k pens'],
    //     [new Date(2008, 1 ,6), 33322, undefined, undefined]
    //   ]);
    //
    //   var chart = new google.visualization.AnnotationChart(document.getElementById('timelinediv'));
    //   chart.draw(data, {displayAnnotations: false});
    // }
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
}
