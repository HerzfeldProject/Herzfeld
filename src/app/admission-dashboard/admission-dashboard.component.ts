import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import {PieChartData} from '../models/pieChartData';
import {AdmissionDashboardService} from './admission-dashboard.service';
import {BarChartData} from '../models/barChartData';
import {Weights} from '../models/weights';

@Component({
  // selector: 'app-followup/admission-dashboard',
  templateUrl: './admission-dashboard.component.html',
  styleUrls: ['./admission-dashboard.component.css']
})
export class AdmissionDashboardComponent implements OnInit, AfterViewInit {

weights = Weights;
title = 'app';
public showIntervals = false;
public colorsCompliance = [ {backgroundColor: ['#019000', '#a41904']}];
// public colorsConcepts = [ {backgroundColor: ['#5ab1b4', '#67a56b', '#5ab1b4', '#67a56b', '#5ab1b4', '#67a56b', '#5ab1b4', '#67a56b']}];
public colorsConcepts = [ {backgroundColor: ['#14143e', '#951630', '#cf3800', '#b69200', '#008e62', '#057695', '#841386', '#fff']}];

admissionCompliance: PieChartData;
admissionConcepts: BarChartData;

constructor(private admDashService: AdmissionDashboardService) {}

ngOnInit() {

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
  this.admissionConcepts.labels = ['pain', 'norton', 'skin', 'diagnostic', 'albumin', 'nutrition'];
  this.admissionConcepts.datasets =  [      {data: [65, 59, 80, 81, 56, 55], label: 'Completion percentages'}];
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

      dataTable.addColumn({ type: 'string', id: 'President' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });
      dataTable.addRows([
        [conceptName, new Date(2019, 3, 30), new Date(2019, 4, 8) ],
        [ 'Adams',      new Date(2019, 4, 8),  new Date(2019, 4, 25) ],
        [ 'Jefferson',  new Date(2019, 4, 25),  new Date(2019, 5, 1) ]]);

      chart.draw(dataTable);
    }
    const titleOfIntervales = document.createElement('h5');
    titleOfIntervales.textContent = '  ';
    titleOfIntervales.textContent = conceptName + ' complition';
    document.getElementById('intervalsPatients').appendChild(titleOfIntervales);
    document.getElementById('intervalesDashboard').focus();
}
onPatientClick(patientname, conceptname) {

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
  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }
}
