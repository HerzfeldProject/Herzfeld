import {Component, OnInit, AfterViewInit, Input, ViewChild, Output} from '@angular/core';
import { Chart } from 'chart.js';
import {PieChartData} from '../models/pieChartData';
import {AdmissionDashboardService} from './admission-dashboard.service';
import {BarChartData} from '../models/barChartData';
import {Weights} from '../models/weights';
import {BaseServiceService} from '../services/baseService.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  // selector: 'app-followup/admission-dashboard',
  templateUrl: './admission-dashboard.component.html',
  styleUrls: ['./admission-dashboard.component.css']
})
export class AdmissionDashboardComponent implements OnInit, AfterViewInit {

@Input() mainRequest;
public checked = false;
weights = Weights;
title = 'app';
public showIntervals = false;
public colorsCompliance = [ {backgroundColor: ['#01b300', '#ed1d04']}];
// public colorsConcepts = [ {backgroundColor: ['#5ab1b4', '#67a56b', '#5ab1b4', '#67a56b', '#5ab1b4', '#67a56b', '#5ab1b4', '#67a56b']}];
public colorsConcepts = [ {backgroundColor: ['#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2', '#51bcc2']}]; // , '#d6193f', '#ff4200', '#01e800', '#008e62', '#057695', '#841386', '#fff']}];

admissionCompliance: PieChartData;
admissionConcepts: BarChartData;

constructor(private admDashService: AdmissionDashboardService, private basesrv: BaseServiceService,   private route: ActivatedRoute,
            private router: Router) {
  this.route.params.subscribe(params => {
    this.mainRequest = params['mainR'];
  });
  this.basesrv.getCompliance(this.mainRequest, data => {
    const plan = this.basesrv.prepareXMLofCompliance(data);
    console.log(plan);
    // this.serched = false;
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


  this.checked = false;
    // document.getElementById('intervalesDashboard').setAttribute('*ngIf', 'true');
    // create pie chart
    this.admissionCompliance = new PieChartData();
    const temp = this.admDashService.calculateTotalCompliance();
    this.admissionCompliance.finalValue = [temp, 100 - temp];
    this.admissionCompliance.options = {
      cutoutPercentage: 50,
      elements: {
        center: {
          text: temp + '%',
          fontColor: '#25b400',
          fontSize: 50,
          fontStyle: 'normal',
          sidePadding: 20
        }
      }};

  // create bar chart
  this.admissionConcepts = new BarChartData();
  this.admissionConcepts.labels = ['Pain', 'Norton', 'Skin', 'Albumin', 'Nutrition'];
  this.admissionConcepts.datasets =  [{data: [65, 59, 81, 56, 55], label: 'Completion percentages'}];
  this.admissionConcepts.options = {
    onClick: this.onConceptClick,
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
}
  onConceptClick(c, i) {

  const conceptName = i[0]._model.label;
  //
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

  // calculateIntervalesForAllPatients
    google.charts.load('current', { 'packages': ['corechart', 'timeline']});
    google.charts.setOnLoadCallback(drawTimeLine);

    function drawTimeLine() {
      const container = document.getElementById('timelinediv');
      const chart = new google.visualization.Timeline(container);
      const dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'value' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });
      dataTable.addColumn({type: 'string', role: 'tooltip'});
      dataTable.addRows([
        ['True', new Date(2018, 4, 1, ), new Date(2018, 4, 3), '<div style="font-size: 15px;font-weight: bold"> 3 Patients from 5 <br>Duration: 2 days </div>'], //  311673313, 325846795, 201125689
        [ 'False', new Date(2018, 4, 1, ), new Date(2018, 4, 3), '<div style=" font-size: 15px;font-weight: bold">2 Patients from 5 <br>Duration: 2 days</div>' ], // Patients: 204587685, 321587654
        ['True', new Date(2018, 4, 5), new Date(2018, 4, 6), '<div style=" font-size: 15px;font-weight: bold">1 Patients from 5 <br>Duration: 1 days</div>'], // Patients:  201125689
        [ 'False', new Date(2018, 4, 5), new Date(2018, 4, 6), '<div style=" font-size: 15px;font-weight: bold">4 Patients from 5 <br>Duration: 1 days</div>' ], // Patients: 204587685, 321587654, 311673313, 325846795
        ['True', new Date(2018, 4, 10), new Date(2018, 4, 11), '<div style=" font-size: 15px;font-weight: bold">2 Patients from 5 <br>Duration: 10 days</div>'], // Patients:  325846795, 201125689
        [ 'False', new Date(2018, 4, 10), new Date(2018, 4, 11), '<div style=" font-size: 15px;font-weight: bold">3 Patients from 5 <br>Duration: 10 days</div></div>' ], // Patients: 204587685, 321587654, 311673313
        ]);

      function myHandler(e) {
        if (e.row != null) {
          const gog = document.getElementsByClassName('google-visualization-tooltip')[0];
          gog.innerHTML = dataTable.getValue(e.row, 3); // .css({width: "auto",height: "auto"});
          gog.setAttribute('css', '{width: auto; height: auto}');
        }
      }
      const options = {
        avoidOverlappingGridLines: false,
        tooltip: { isHtml: true }
      };
      google.visualization.events.addListener(chart, 'onmouseover', myHandler);
      google.visualization.events.addListener(chart, 'select', function () {
        const modal = document.createElement('div');
        modal.style.marginLeft = '10px';
        modal.className = 'row well col-lg-4 col-md-4';
        modal.style.fontWeight = 'bold';
        modal.innerHTML = '<h5 style="color: #0071c5">Description</h5> <br>' +
          'Patients: 311673313, 325846795, 201125689';
        document.getElementById('description').appendChild(modal);

        // this.checked = true;

        // const form = document.createElement('mat-form-field');
        // const select = document.createElement('mat-select');
        // select.style.marginTop = '22px';
        // select.setAttribute('placeholder', 'Choose Patient:');
        //
        // const op1 = document.createElement('mat-option');
        // op1.textContent = '311673313';
        // op1.setAttribute('click', 'onPatientClick(op1.textContent, conceptName)');
        // const op2 = document.createElement('mat-option');
        // op1.textContent = '325846795';
        // const op3 = document.createElement('mat-option');
        // op1.textContent = '201125689';
        //
        // document.getElementById('description').appendChild(form.appendChild(select.appendChild(op1).appendChild(op2).appendChild(op3)));
      });
      chart.draw(dataTable, options);
    }

    const titleOfIntervales = document.createElement('h5');
    titleOfIntervales.style.color = '#0071c5';
    titleOfIntervales.style.fontSize = '20px';
    titleOfIntervales.textContent = conceptName + ' Compliance of Selected Patients';
    document.getElementById('intervalsPatients').appendChild(titleOfIntervales);
     document.getElementById('intervalesDashboard').focus();
}

 // public onPatientClick(patientname, conceptname) {
 //  google.charts.load('current', { 'packages': ['corechart', 'timeline']});
 //  google.charts.setOnLoadCallback(drawTimeLine);
 //
 //  function drawTimeLine() {
 //    const container = document.getElementById('timelinediv2');
 //    const chart = new google.visualization.Timeline(container);
 //    const dataTable = new google.visualization.DataTable();
 //
 //    dataTable.addColumn({ type: 'string', id: 'value' });
 //    dataTable.addColumn({ type: 'date', id: 'Start' });
 //    dataTable.addColumn({ type: 'date', id: 'End' });
 //    dataTable.addColumn({type: 'string', role: 'tooltip'});
 //    dataTable.addRows([
 //      ['True', new Date(2018, 4, 1, ), new Date(2018, 4, 3), '<div style="font-size: 15px;font-weight: bold"> 3 Patients from 5 <br>Duration: 2 days </div>'], //  311673313, 325846795, 201125689
 //      [ 'False', new Date(2018, 4, 5), new Date(2018, 4, 6), '<div style=" font-size: 15px;font-weight: bold">4 Patients from 5 <br>Duration: 1 days</div>' ], // Patients: 204587685, 321587654, 311673313, 325846795
 //      [ 'False', new Date(2018, 4, 10), new Date(2018, 4, 20), '<div style=" font-size: 15px;font-weight: bold">3 Patients from 5 <br>Duration: 10 days</div></div>' ], // Patients: 204587685, 321587654, 311673313
 //    ]);
 //
 //    chart.draw(dataTable);
 //  }
//
//   const titleOfIntervales = document.createElement('h5');
//   titleOfIntervales.style.color = '#0071c5';
//   titleOfIntervales.style.fontSize = '20px';
//   titleOfIntervales.textContent = 'Compliance for +' + patientname + ' in the ' + conceptname + ' concept';
//   document.getElementById('intervalsPatient').appendChild(titleOfIntervales);
// }

  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }
}
