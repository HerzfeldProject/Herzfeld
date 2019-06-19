import { Injectable } from '@angular/core';
import {Plan} from '../models/plan';
import {DataInstance} from '../models/dataInstance';
// import {planType} from '../models/planType';

@Injectable({
  providedIn: 'root'
})


export class XmlToObjectService {

  constructor() { }
  prepareXMLofKnowledge(data) {
    const tempdata = data.children[0];
    const result = [];
    if (tempdata.nodeName.toString().toLowerCase().includes('compliance')) {
      for (let i = 0; i < tempdata.children.length; i++) {
        result.push(this.createSubPlan(tempdata.children[i]));
      }
    }
    return result;
  }
  prepareXMLofCompliance(data) {
    const start = data.children;
    let plan;
    if (start[0].nodeName.toString().toLowerCase().includes('plan')) {
      plan = new Plan();
      plan.name = start[0].attributes.name.nodeValue;
      if (start[0].attributes.concept_id !== undefined) {
        plan.conceptId = start[0].attributes.concept_id.nodeValue;
      }
      plan.weight = start[0].attributes.weight.nodeValue;
      plan.score = start[0].attributes.score.nodeValue;
      plan.subPlans = [];
    }
    for (let i = 0; i < start[0].children.length; i++) {
      if ( start[0].children[i].nodeName.toString().toLowerCase().includes('plan')) {
        plan.subPlans.push(this.createSubPlan( start[0].children[i]));
      }
    }
    return plan;
  }
  createSubPlan(start) {
    const plan = new Plan();
    plan.icons = [];
    plan.name = start.attributes.name.nodeValue;
    if (start.attributes.concept_id !== undefined) {
      plan.conceptId = start.attributes.concept_id.nodeValue;
    }
    if(start.attributes.filter !== undefined){
      plan.filter = start.attributes.filter.nodeValue;
    }
    plan.weight = start.attributes.weight.nodeValue;
    if (start.attributes.score !== undefined) {
      plan.score = start.attributes.score.nodeValue;
    }
    if (start.attributes.patient_score_one !== undefined) {
      plan.patientList100 = start.attributes.patient_score_one.nodeValue;
    }
    if (start.attributes.patient_score_zero !== undefined) {
      plan.patientList0 = start.attributes.patient_score_zero.nodeValue;
    }
    if (start.attributes.patient_score_partial !== undefined) {
      plan.patientListPart = start.attributes.patient_score_partial.nodeValue;
    }
    plan.subPlans = [];
    if (start.children[0].nodeName.toString().toLowerCase().includes( 'plans')) {
      // go over every plan and check if 'plans' or other
      const childs = start.children[0].children;
      for (let j = 0; j < childs.length; j++) {
        if (childs[j].nodeName.toString().toLowerCase().includes( 'plan')) {
          plan.subPlans.push(this.createSubPlan(childs[j]));
        }
      }
    } else {
      for (let k = 0; k < start.children.length; k++) {
        const sub = new Plan();
        sub.name = start.children[k].localName;
        plan.subPlans.push(sub);
        plan.icons.push(sub.name);
      }
    }
    return plan;
  }
  prepareXMLofSubPlans(data) {
    const temp: string[] = [];
    for (let i = 0; i < data.length; i++) {
      temp.push(data[i].innerHTML);
    }
    return temp;
  }
  prepareXMLofPatients(data) {
    const temp = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        temp.push({id: data.item(i).textContent, name: data.item(i).textContent});
      }
    }
    return temp;
  }
  prepareXMLofDepartmentWithPatints(data) {
    const temp = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        temp.push({dep: data.item(i).children[4].textContent,  patients: data.item(i).children[2].textContent});
      }
    }
    return temp;
  }
  prepareXMLofDepartment(data) {
    const names = [];
    const temp = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if(!names.includes(data[i].dep)) {
          names.push(data[i].dep)
          temp.push({id: data[i].dep, name: data[i].dep});
        }
      }
    }
    return temp;
  }
  prepareXMLofDATA(data) {
    const dataInstances = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const temp = new DataInstance();
        temp.conceptName = data.item(i).childNodes[0].innerHTML;
        temp.endTime = data.item(i).childNodes[1].innerHTML;
        temp.entityId = data.item(i).childNodes[2].innerHTML;
        temp.startTime = data.item(i).childNodes[3].innerHTML;
        temp.value = data.item(i).childNodes[4].innerHTML;
        dataInstances.push(temp);
      }
    }
    return dataInstances;
  }
  createDataInstances(data, start, end) {
    const relevantData = [];
    for (let i = 0; i < data.length; i++) {
      if (new Date(data[i].startTime) >= start && new Date(data[i].endTime) <= end ) {
        relevantData.push(data[i]);
      }
    }
    relevantData.sort((a, b) => b.value - a.value );
    return relevantData;
  }
  combinIntervals(data){
    const start = [];
    const end = [];
    const newInt = [];
    for (let i = 0; i < data.length; i++) {
      if(!start.includes(data[i].startTime.substring(0, data[i].startTime.indexOf('T'))
        && ! end.includes(data[i].endTime.substring(0, data[i].endTime.indexOf('T'))))){
        let entity = data[i].entityId;
        for(let k = i+1; k < data.length; k++){
          if( data[i].value == data[k].value
            && data[i].startTime.substring(0, data[i].startTime.indexOf('T')) == data[k].startTime.substring(0, data[k].startTime.indexOf('T'))
            && (data[i].endTime.substring(0, data[i].endTime.indexOf('T')) == data[k].endTime.substring(0, data[k].endTime.indexOf('T')) )){
            entity = entity + ', ' + data[k].entityId;
          }
        }
        start.push(data[i].startTime.substring(0, data[i].startTime.indexOf('T')));
        end.push(data[i].endTime.substring(0, data[i].endTime.indexOf('T')));
        const n = new DataInstance();
        n.startTime = data[i].startTime;
        n.endTime = data[i].endTime;
        n.value = data[i].value;
        n.entityId = entity;
        newInt.push(n);
        i++;
      }
    }
    return newInt;
  }
  fromPlanNameToRelevantConceptId(subPlan, name, isFirst) {
    const conceptIds = [];
    if (isFirst) {
      for (let i = 0; i < subPlan.length; i++) {
        if (subPlan[i].name === name) {
          if (subPlan[i].conceptId !== undefined) {
            conceptIds.push(subPlan[i].conceptId);
            break;
          } else {
            const temp = subPlan[i].subPlans;
            return this.fromPlanNameToRelevantConceptId(temp, name, false);
          }
        }
      }
    } else {
        for (let k = 0; k < subPlan.length; k++) {
          if (subPlan[k].conceptId !== undefined) {
            conceptIds.push(subPlan[k].conceptId);
          } else {
            const addConcepts = this.fromPlanNameToRelevantConceptId(subPlan[k].subPlans, name, false);
            for (let h = 0; h < addConcepts.length; h++) {
              conceptIds.push(addConcepts[h]);
            }
          }
        }
    }
    return conceptIds;
  }
}
