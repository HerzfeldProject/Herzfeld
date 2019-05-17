import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import {DataRequest} from '../models/dataRequest';
import {SharedRequestService} from '../services/shared-request.service';
import {BaseServiceService} from '../services/baseService.service';
import {XmlToObjectService} from '../services/xml-to-object.service';

@Component({
  selector: 'app-follow-up-dashboard',
  templateUrl: './follow-up-dashboard.component.html',
  styleUrls: ['./follow-up-dashboard.component.css']
})
export class FollowUpDashboardComponent {
  mainRequest: DataRequest;
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

  constructor(private breakpointObserver: BreakpointObserver, private sharedR: SharedRequestService, private basesrv: BaseServiceService, private xmltosrv: XmlToObjectService) {
    this.sharedR.currentRequest.subscribe(data => this.mainRequest = data);
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'followUp';
    this.basesrv.getCompliance(this.mainRequest, data => {
      const plan = this.xmltosrv.prepareXMLofCompliance(data);
      console.log(plan);
    });
  }

  public expand = false;
  public pieChartLabels: string[] = ['True', 'False'];
  public pieChartData: number[] =  [0.8, 0.2];
  public pieChartType = 'doughnut';
  public pieChartOptions: any = {'backgroundColor': [
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
    ], 'elements': {
      'center' : {
        'text': '90%',
        'color': '#FF6384', // Default is #000000
        'fontStyle': 'Arial', // Default is Arial
        'sidePadding': 20 // Defualt is 20 (as a percentage)
      }
    } };

    public barChartOptions = {
      scaleShowVerticalLines: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },

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
          'rgba(255, 159, 64, 0.2)']
    };
    public barChartLabels = ['skin', 'norton', 'pain'];
    public barChartType = 'bar';
    public barChartLegend = true;
    public barChartData = [
      {data: [0.8, 0.8, 1], label: 'compliance'},
      // {data: [0.2, 0.6, 0.7], label: 'order'},
      // {data: [1, 1, 1], label: 'period'},
      // {data: [0.1, 0.5, 0.6], label: 'binary'},
      // {data: [0.5, 0.7, 1], label: 'more'}
    ];
  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

 // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }
  public expandData() {
    console.log('erre');
    this.expand = true;
  }
  ngOnInit() {
  }

}
