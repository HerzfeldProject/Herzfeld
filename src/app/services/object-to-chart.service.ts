import { Injectable } from '@angular/core';
import {PieChartData} from '../models/pieChartData';
import {BarChartData} from '../models/barChartData';
import {XmlToObjectService} from './xml-to-object.service';
import {BaseServiceService} from './baseService.service';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class ObjectToChartService {

  mainReq;
  mainPlan;

  constructor(private xmltosrv: XmlToObjectService, private basesrv: BaseServiceService) {
  }

  createPieChart(score) {
    const admissionCompliance = new PieChartData();
    admissionCompliance.finalValue = [score, 1 - score];
    admissionCompliance.options = {
      cutoutPercentage: 50,
      elements: {
        center: {
          text: Math.round(score * 100) + '%',
          fontColor: '#25b400',
          fontSize: 30,
          fontStyle: 'normal',
          sidePadding: 20
        }
      }
    };
    return admissionCompliance;
  }

  createBarChart(subPlans, mainReq) {
    this.mainPlan = subPlans;
    this.mainReq = mainReq;
    const admissionConcepts = new BarChartData();
    admissionConcepts.datasets = [{data: [], label: 'Completion percentages', metadata: []}, {label: 'line', data: [], type: 'line'}];
    admissionConcepts.labels = [];
    for (let i = 0; i < subPlans.length; i++) {
      admissionConcepts.labels.push(subPlans[i].name);
      admissionConcepts.datasets[0].data.push(subPlans[i].score);
      admissionConcepts.datasets[1].data.push(subPlans[i].score);
      // admissionConcepts.datasets[0].metadata.push(subPlans[i].conceptId);
    }
    admissionConcepts.options = {
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
    return admissionConcepts;
  }
  onConceptClick(c, i) {

    const child = document.getElementById('intervalsPatients');
    const len = child.childNodes.length;
    if (len > 0) {
      for (let j = 0; j < len; j++) {
        child.removeChild(child.childNodes[j]);
      }
    }

    const conceptName = i[0]._model.label;
    const clickedConcepts = this.xmltosrv.fromPlanNameToRelevantConceptId(this.mainPlan, conceptName, true);
    for (let j = 0; j < clickedConcepts.length; j++) {
      this.basesrv.getData(this.mainReq, clickedConcepts[j], data => {
        const temp = this.xmltosrv.prepareXMLofDATA(data);
        const relevant = this.xmltosrv.createDataInstances(temp, this.mainReq.startDate, this.mainReq.endDate);

        if(relevant.length == 0){
          let empty = document.createElement('h2');
          empty.textContent = 'no data for ' + conceptName;
          document.getElementById('timelinediv').appendChild(empty);

        } else {
          // calculateIntervalesForAllPatients
          google.charts.load('current', {'packages': ['corechart', 'timeline']});
          google.charts.setOnLoadCallback(drawTimeLine.bind(relevant));

          const titleOfIntervales = document.createElement('h5');
          titleOfIntervales.style.color = '#0071c5';
          titleOfIntervales.style.fontSize = '20px';
          titleOfIntervales.textContent = conceptName + ' Compliance of Selected Patients';
          document.getElementById('intervalsPatients').appendChild(titleOfIntervales);
          document.getElementById('intervalesDashboard').focus();
        }
      });
    }

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

      // function myHandler(e) {
      //   if (e.row != null) {
      //     const gog = document.getElementsByClassName('google-visualization-tooltip')[0];
      //     gog.innerHTML = dataTable.getValue(e.row, 3); // .css({width: "auto",height: "auto"});
      //     gog.setAttribute('css', '{width: auto; height: auto}');
      //   }
      // }
      const options = {
        height: 40 + (dataTable.getNumberOfRows() * 40),
        avoidOverlappingGridLines: true,
        tooltip: {isHtml: true}
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
}
