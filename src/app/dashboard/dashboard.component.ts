import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-followup/dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  /** Based on the screen size, switch from standard to one column per row */
   cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }
      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
 LineChart = [];


  constructor(private breakpointObserver: BreakpointObserver) {

  }
  title = 'app';
  public pieChartLabels:string[] = ['pain', 'norton', 'skin', 'diagnostic', 'albumin', 'nutrition', 'Not Executed'];
  public pieChartData:number[] =  [10, 20, 35, 5, 5, 10, 15];
  public pieChartType:string = 'pie';
  public pieChartOptions:any = {'backgroundColor': [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)']
    , 'borderColor': [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
    ] }

    public barChartOptions = {
      responsive: true,
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'],
      backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'],
      scaleShowVerticalLines: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
    };
    public barChartLabels = ['pain', 'norton', 'skin', 'diagnostic', 'albumin', 'nutrition'];
    public barChartType = 'bar';
    public barChartLegend = true;
    public barChartData = [
      {data: [65, 59, 80, 81, 56, 55], label: 'Completion percentages'},
      // {data: [28, 48, 40, 19, 86, 27], label: 'order'},
      // {data: [28, 38, 45, 14, 80, 15], label: 'period'},
      // {data: [28, 38, 45, 14, 80, 15], label: 'binary'},
      // {data: [28, 38, 45, 14, 80, 15], label: 'more'}


    ];
  // events on slice click
  public chartClicked(e:any):void {
    console.log(e);
  }

 // event on pie chart slice hover
  public chartHovered(e:any):void {
    console.log(e);
  }
  ngOnInit(){

  }
}
