import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  histogToolTip(tooltipModel) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip');
    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.innerHTML = '<table></table>';
      document.body.appendChild(tooltipEl);
    }
    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }
    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }
    function getBody(bodyItem) {
      return bodyItem.lines;
    }
    function getplanTree(mymeta, count){
      let htmltoadd = '';
      if(mymeta.icons.length > 0){
        htmltoadd = htmltoadd + '<tr><th><span></span>';
        for(let j = 0; j < count ; j++){
          htmltoadd = htmltoadd + '&nbsp;&nbsp;&nbsp;';
        }
        htmltoadd = htmltoadd + '-'+ mymeta.name + '' + iconToHtml(mymeta.icons[0]) + '</th></tr>';
      } else {
        htmltoadd = htmltoadd + '<tr><th><span></span>';
        for(let j = 0; j < count ; j++){
          htmltoadd = htmltoadd + '&nbsp;&nbsp;&nbsp;';
        }
        htmltoadd = htmltoadd + '-'+ mymeta.name + '</th></tr>';
        for(let i=0; i< mymeta.subPlans.length; i++){
          htmltoadd = htmltoadd + getplanTree(mymeta.subPlans[i], count + 1 );
        }
      }
      return htmltoadd;
    }
    function iconToHtml(icon){
      if(icon === 'binary'){
        return '<i style="size: 16px; cursor: pointer" title="Binary - action done at least once" class="fa fa-check-square"></i>\n';
      } else if(icon === 'average'){
        return '<i style="size: 16px; cursor: pointer" title="plan with average score" class="fa fa-percent"></i>'
      } else if(icon === 'periodic'){
        return '<i style="size: 16px; cursor: pointer" title="plan with periodic score" class="fa fa-history"></i>';
      } else if(icon === 'start_condition' || icon === 'multiple_start_condition'){
        return '<i style="size: 16px; cursor: pointer" title="plan with start condition score" class="fa fa-filter"></i>';
      } else if(icon === 'order'){
        return '<i style="size: 16px; cursor: pointer" title="plan with start condition score" class="fa fa-sort-amount-up"></i>'; // <mat-icon style="cursor: pointer;size: 16px" aria-hidden="false" title="plan with order score" aria-label="Example home icon"> sort</mat-icon>'
      }
    }
    // Set Text
    if (tooltipModel.body) {
      let myPlanMeta;
      const titleLines = tooltipModel.title || [];
      // @ts-ignore
      for(let i=0; i< this._data.datasets[0].metadata.length; i++){
        // @ts-ignore
        if(this._data.datasets[0].metadata[i].name === titleLines[0]){
          // @ts-ignore
          myPlanMeta = this._data.datasets[0].metadata[i];
        }
      }
      let innerHtml = '<thead style="color: white; font-size: 18px">';
      innerHtml += '<tr><th>' + titleLines[0] + '</th></tr>';
      innerHtml += '</thead><tbody style="font-size: 14px">';
      if(myPlanMeta.filter !== undefined){
        innerHtml += '<tr><th><span></span> details:' + myPlanMeta.filter + '&nbsp;</th></tr>';
      }
      innerHtml += '<tr><th><span></span> score:' + parseFloat(myPlanMeta.score).toFixed(2) + '&nbsp;';
      if(myPlanMeta.icons.length > 0){
        innerHtml += iconToHtml(myPlanMeta.icons[0]) + '</th></tr>';
      } else {
        innerHtml += '</th></tr>';
        innerHtml +=  getplanTree(myPlanMeta, 0);
      }
      innerHtml += '</tbody>';

      const tableRoot = tooltipEl.querySelector('table');
      tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    // @ts-ignore
    const position = this._chart.canvas.getBoundingClientRect();
    tooltipEl.style.opacity = '0.8';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.backgroundColor = 'black';
    tooltipEl.style.color = 'white';
    tooltipEl.style.width = 'auto';
    tooltipEl.style.height = 'auto';
    tooltipEl.style.borderRadius = '15px';
    tooltipEl.style.borderWidth = '2px';
    tooltipEl.style.fontSize = '16px';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.zIndex = '1';
  }
  drawTimeLine(relevant) {
    const chart = new google.visualization.Timeline(document.getElementById('timelinediv'));
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn({type: 'string', id: 'value'});
    dataTable.addColumn({type: 'date', id: 'Start'});
    dataTable.addColumn({type: 'date', id: 'End'});
    dataTable.addColumn({type: 'string', role: 'tooltip'});
    dataTable.addRows([]);
    // add option of number patients - combain
    // @ts-ignore
    for (let i = 0; i < this.length; i++) {
      let num = this[i].value;
      if (num.includes('.')) {
        num = Number(num).toFixed(1);
        if (num.includes('.0')) {
          num = num.substring(0, 1);
        }
      }

      // @ts-ignore
      if(this.length === 1){
        dataTable.addRow([num, new Date(new Date(this[0].startTime).getFullYear(), new Date(this[0].startTime).getMonth(), new Date(this[0].startTime).getDay(), new Date(this[0].startTime).getHours(), new Date(this[0].startTime).getMinutes(), new Date(this[0].startTime).getSeconds()),
          new Date(new Date(this[0].startTime).getFullYear(), new Date(this[0].startTime).getMonth(), new Date(this[0].startTime).getDay(), new Date(this[0].startTime).getHours(), new Date(this[0].startTime).getMinutes(), new Date(this[0].startTime).getSeconds() + 1),
          createToolTip(this[i])]);
      } else {
        dataTable.addRow([num, new Date(this[i].startTime), new Date(this[i].endTime), createToolTip(this[i])]);
      }
    }

    let height = 0;
    const val = [];
    // @ts-ignore
    for(let i=0; i< dataTable.wg.length; i++){
      // @ts-ignore
      if(!val.includes(dataTable.wg[i].c[0].v)){
        height = height + 40;
      } else {
        height = height + 10;
      }
      // @ts-ignore
      val.push(dataTable.wg[i].c[0].v);
    }
    const options = {
      height: (50 + height) < 210 ? 210 :  (50 + height),
      avoidOverlappingGridLines: false,
      tooltip: {isHtml: true},
      // hAxis: {
      //   minValue: new Date(new Date(this[0].startTime).getFullYear(), new Date(this[0].startTime).getMonth(), new Date(this[0].startTime).getDay() - 1),
      //   // @ts-ignore
      //   maxValue: new Date(new Date(this[this.length - 1].endTime).getFullYear(), new Date(this[this.length - 1].endTime).getMonth(), new Date(this[this.length - 1 ].endTime).getDay() + 1),
      // }
    };
    function createToolTip(plantouse){
      const start =  new Date(plantouse.startTime);
      const end =  new Date(plantouse.endTime);
      return '<table> <thead style="color: white; font-size: 18px; font-weight: bold"><tr><td>Details: </td></tr></thead><tbody  style="color: white; size: 14px">' +
        '<tr><td><span></span>' + 'Patients id\'s:  ' + plantouse.entityId + '</td></tr>' +
        '<tr><td><span></span>' + 'Score:  ' + plantouse.value + '</td></tr>' +
        '<tr><td><span></span>' + 'Start Date:  ' + start.toDateString() + ' , ' + start.toTimeString() + '</td></tr>' +
        '<tr><td><span></span>' + 'End Date:  ' + end.toDateString() + ' , ' + end.toTimeString() + '</td></tr>' +
        '</tbody></table>';
    }
    google.visualization.events.addListener(chart, 'onmouseover', function (e) {
      if (e.row != null) {
        const gog = document.getElementsByClassName('google-visualization-tooltip')[0];
        gog.setAttribute('style', 'background-color: black; opacity: 0.8; border-width: 2px; font-size: 16px;  padding: 20px; width: auto; height: auto; border-radius: 25px; left: 172.861px; top: 42.496px; pointer-events: none;');
        gog.innerHTML = dataTable.getValue(e.row, 3); // .css({width: "auto",height: "auto"});
      }
    });
    google.visualization.events.addListener(chart, 'ready', function (e) {
      document.getElementById('timelinediv').hidden = true;
    });
    chart.draw(dataTable, options);
  }
  afterView(){
    return     Chart.pluginService.register({
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
          const val = parseFloat(chart.config.data.datasets[0].data[0]).toFixed(2);
          ctx.fillText(Math.round(parseFloat(val) * 100) + '%', centerX, centerY);
          ctx.restore();
        }
      },
    });
  }
  intervalExplanation(icon){
    if(icon === 'periodic'){
      return 'Periodic: Intervals with scores';
    } else if(icon === 'order'){
      return 'Order: Action that are in the wrong order'
    } else if(icon === 'average'){
      return 'Average: Data with scores, time interval is the time action need to be done';
    } else if(icon === 'binary'){
      return 'Binary: number of actions for patient';
    } else if(icon === 'start_condition' || icon === 'multiple_start_condition'){
      return 'Start Condition: Right Data in Right condition';
    }
  }

}
