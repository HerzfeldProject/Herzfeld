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

@Component({
  // selector: 'app-followup/admission-dashboard',
  templateUrl: './admission-dashboard.component.html',
  styleUrls: ['./admission-dashboard.component.css'],
  providers: [BaseServiceService, ObjectToChartService]
})
export class AdmissionDashboardComponent implements OnInit, AfterViewInit {

public mainRequest: DataRequest;
public checked = false;
// weights = Weights;
public mainPlan = new Plan();
title = 'app';
public showIntervals = false;
public colorsCompliance = [ {backgroundColor: ['#01b300', '#ed1d04']}];
public colorsConcepts = [ {backgroundColor: ['#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2']}];
public admissionCompliance: PieChartData;
public admissionConcepts: BarChartData;

constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService,   private route: ActivatedRoute,
            private router: Router, private xmltosrv: XmlToObjectService,
            private sharedR: SharedRequestService, private objToChart: ObjectToChartService) {
  // this.onConceptClick.bind({'myapp': this});
  this.mainRequest = this.sharedR.request.value;
  this.mainRequest.stage = 'admission';
  this.basesrv.getCompliance(this.mainRequest, data => {
    this.mainPlan = this.xmltosrv.prepareXMLofCompliance(data);
    console.log(this.mainPlan);
    this.checked = false;
    // create pie chart
    this.admissionCompliance = this.objToChart.createPieChart(this.mainPlan.score);
    // create bar chart
    // this.admissionConcepts = this.objToChart.createBarChart(this.mainPlan.subPlans);
    this.admissionConcepts = new BarChartData();
    this.admissionConcepts.datasets =  [{data: [], label: 'Completion percentages', metadata: []}];
    this.admissionConcepts.labels = [];
    for (let i = 0; i < this.mainPlan.subPlans.length; i++) {
      this.admissionConcepts.labels.push(this.mainPlan.subPlans[i].name);
      this.admissionConcepts.datasets[0].data.push(this.mainPlan.subPlans[i].score);
      this.admissionConcepts.datasets[0].metadata.push(this.mainPlan.subPlans[i].conceptId);
    }
    this.admissionConcepts.options = {
      onClick: this.onConceptClick.bind(this),
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
  });
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
  onConceptClick(c, i) {

     const conceptName = i[0]._model.label;
    // let clickedPlan;
    // for (let j = 0; j < this.mainPlan.subPlans.length; j++) {
    //   if(this.mainPlan.subPlans[i].name === conceptName) {
    //     clickedPlan = this.mainPlan.subPlans[i];
    //   }
    // }
    this.basesrv.getData(this.mainRequest, '11031', data => {
      const temp = this.xmltosrv.prepareXMLofDATA(data);
      const relevant = this.xmltosrv.createDataInstances(temp, this.mainRequest.startDate, this.mainRequest.endDate);

      // calculateIntervalesForAllPatients
      google.charts.load('current', { 'packages': ['corechart', 'timeline']});
      google.charts.setOnLoadCallback(drawTimeLine.bind(relevant));

      const titleOfIntervales = document.createElement('h5');
      titleOfIntervales.style.color = '#0071c5';
      titleOfIntervales.style.fontSize = '20px';
      titleOfIntervales.textContent = conceptName + ' Compliance of Selected Patients';
      document.getElementById('intervalsPatients').appendChild(titleOfIntervales);
      document.getElementById('intervalesDashboard').focus();
    });

    // const tile = document.createElement('mat-grid-tile');
    // tile.setAttribute('rowHeight', 'fit');
    // const card = document.createElement('mat-card');
    // card.setAttribute('class', 'dashboard-card');
    // const head = document.createElement('mat-card-header');
    // const title = document.createElement('mat-card-title');
    // const div = document.createElement('div');
    // div.setAttribute('id', 'intervalsPatients')
    // const content = document.createElement('mat-card-content');
    // const div2 = document.createElement('div');
    // div2.setAttribute('id', 'timelinediv');
    // div2.setAttribute('style', 'display: block;width: 100%');
    // document.getElementById('intervalesDashboard').appendChild(tile.appendChild(
    //   card.appendChild(head.appendChild(title.appendChild(div))).appendChild(content.appendChild(div2))));
    function drawTimeLine(relevant) {
      const container = document.getElementById('timelinediv');
      const chart = new google.visualization.Timeline(container);
      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn({ type: 'string', id: 'value' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });
      // dataTable.addColumn({type: 'string', role: 'tooltip'});
      dataTable.addRows([]);


      // add option of number patients - combain
      for (let i = 0; i < this.length; i++) {
        let num  = this[i].value;
        if (num.includes('.')) {
          num = Number(num).toFixed(1);
          if (num.includes('.0')) {
            num = num.substring(0, 1);
          }
        }
        dataTable.addRow([num, new Date(this[i].startTime), new Date(this[i].endTime)]); // , 'patients id\'s: ' + this[i].entityId ]);
      }

      // function myHandler(e) {
      //   if (e.row != null) {
      //     const gog = document.getElementsByClassName('google-visualization-tooltip')[0];
      //     gog.innerHTML = dataTable.getValue(e.row, 3); // .css({width: "auto",height: "auto"});
      //     gog.setAttribute('css', '{width: auto; height: auto}');
      //   }
      // }
      const options = {
        height: 40 + (dataTable.getNumberOfRows() * 15),
        avoidOverlappingGridLines: false,
        tooltip: { isHtml: true }
      };
      // google.visualization.events.addListener(chart, 'onmouseover', myHandler);
      // google.visualization.events.addListener(chart, 'select', function () {
      //   const modal = document.createElement('div');
      //   modal.style.marginLeft = '10px';
      //   modal.className = 'row well col-lg-4 col-md-4';
      //   modal.style.fontWeight = 'bold';
      //   modal.innerHTML = '<h5 style="color: #0071c5">Description</h5> <br>' +
      //     'Patients: 311673313, 325846795, 201125689';
      //   document.getElementById('description').appendChild(modal);
      //
      //   // this.checked = true;
      //
      //   // const form = document.createElement('mat-form-field');
      //   // const select = document.createElement('mat-select');
      //   // select.style.marginTop = '22px';
      //   // select.setAttribute('placeholder', 'Choose Patient:');
      //   //
      //   // const op1 = document.createElement('mat-option');
      //   // op1.textContent = '311673313';
      //   // op1.setAttribute('click', 'onPatientClick(op1.textContent, conceptName)');
      //   // const op2 = document.createElement('mat-option');
      //   // op1.textContent = '325846795';
      //   // const op3 = document.createElement('mat-option');
      //   // op1.textContent = '201125689';
      //   //
      //   // document.getElementById('description').appendChild(form.appendChild(select.appendChild(op1).appendChild(op2).appendChild(op3)));
      // });
      chart.draw(dataTable, options);
    }
  }
  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }
}
