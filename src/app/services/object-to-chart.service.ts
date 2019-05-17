import { Injectable } from '@angular/core';
import {PieChartData} from '../models/pieChartData';
import {BarChartData} from '../models/barChartData';
import {XmlToObjectService} from './xml-to-object.service';
import {BaseServiceService} from './baseService.service';

@Injectable({
  providedIn: 'root'
})
export class ObjectToChartService {

  constructor(private xmltosrv: XmlToObjectService, private basesrv: BaseServiceService) { }
  createPieChart(score) {
    const admissionCompliance = new PieChartData();
    admissionCompliance.finalValue = [score, 1 - score];
    admissionCompliance.options = {
      cutoutPercentage: 50,
      elements: {
        center: {
          text: Math.round(score * 100) + '%',
          fontColor: '#25b400',
          fontSize: 50,
          fontStyle: 'normal',
          sidePadding: 20
        }
      }};
    return admissionCompliance;
  }

  createBarChart(subPlans) {
    const admissionConcepts = new BarChartData();
    admissionConcepts.datasets =  [{data: [], label: 'Completion percentages', metadata: []}];
    admissionConcepts.labels = [];
    for(let i = 0; i < subPlans.length; i++) {
      admissionConcepts.labels.push(subPlans[i].name);
      admissionConcepts.datasets[0].data.push(subPlans[i].score);
      admissionConcepts.datasets[0].metadata.push(subPlans[i].conceptId);
    }
    admissionConcepts.options = {
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
    return admissionConcepts;
  }
  onConceptClick(c, i) {

    const conceptName = i[0]._model.label;
    // let clickedPlan;
    // for (let j = 0; j < this.mainPlan.subPlans.length; j++) {
    //   if(this.mainPlan.subPlans[i].name === conceptName) {
    //     clickedPlan = this.mainPlan.subPlans[i];
    //   }
    // }
    // this.basesrv.getData('11076', data => {
    //   const temp = this.xmltosrv.prepareXMLofDATA(data);
    // });

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
}
