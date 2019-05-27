import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataRequest} from '../models/dataRequest';
import {Plan} from '../models/plan';
import {PieChartData} from '../models/pieChartData';
import {BarChartData} from '../models/barChartData';
import {Chart} from 'chart.js';
import {AdmissionDashboardService} from '../admission-dashboard/admission-dashboard.service';
import {BaseServiceService} from '../services/baseService.service';
import {ActivatedRoute, Router} from '@angular/router';
import {XmlToObjectService} from '../services/xml-to-object.service';
import {SharedRequestService} from '../services/shared-request.service';
import {ObjectToChartService} from '../services/object-to-chart.service';
@Component({
  selector: 'app-bandaging-dashboard',
  templateUrl: './bandaging-dashboard.component.html',
  styleUrls: ['./bandaging-dashboard.component.css']
})
export class BandagingDashboardComponent implements OnInit, AfterViewInit {

  public pageError = false;
  public mainRequest: DataRequest;
  public checked = false;
// weights = Weights;
  public mainPlan = new Plan();
  title = 'app';
  public showIntervals = false;
  public colorsCompliance = [ {backgroundColor: ['#01b300', '#ed1d04']}];
  public colorsConcepts = [ {backgroundColor: ['#87cf78', '#87cf78', '#87cf78', '#87cf78', '#87cf78', '#87cf78', '#87cf78', '#87cf78', '#87cf78']}];
  public prevCompliance: PieChartData;
  public prevConcepts: BarChartData;

  constructor(private admDashService: AdmissionDashboardService, public basesrv: BaseServiceService,   private route: ActivatedRoute,
              private router: Router, private xmltosrv: XmlToObjectService,
              private sharedR: SharedRequestService, private objToChart: ObjectToChartService) {
    this.mainRequest = this.sharedR.request.value;
    this.mainRequest.stage = 'bandaging';
    // followUpAndPrevention, followUpAndPreventionAndTreatment
    if(localStorage.getItem('bandaging') !== null ) {
      if(localStorage.getItem('bandaging') == 'no data'){
        this.pageError = true;
      } else {
        this.mainPlan = JSON.parse(localStorage.getItem('bandaging'));
        this.checked = false;
        // create pie chart
        this.prevCompliance = this.objToChart.createPieChart(this.mainPlan.score);
        // create bar chart
        this.prevConcepts = this.objToChart.createBarChart(this.mainPlan.subPlans, this.mainRequest);
      }

    } else {
      this.basesrv.getCompliance(this.mainRequest, data => {
        this.mainPlan = this.xmltosrv.prepareXMLofCompliance(data);
        if(this.mainPlan.score == -1) {
          this.pageError = true;
          localStorage.setItem('bandaging', 'no data');
        } else {
          localStorage.setItem('bandaging', JSON.stringify(this.mainPlan));
          this.checked = false;
          // create pie chart
          this.prevCompliance = this.objToChart.createPieChart(this.mainPlan.score);
          // create bar chart
          this.prevConcepts = this.objToChart.createBarChart(this.mainPlan.subPlans, this.mainRequest);
        }
      });
    }
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
}
