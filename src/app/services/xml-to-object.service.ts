import { Injectable } from '@angular/core';
import {Plan} from '../models/plan';
import {DataInstance} from '../models/dataInstance';

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
    plan.name = start.attributes.name.nodeValue;
    if (start.attributes.concept_id !== undefined) {
      plan.conceptId = start.attributes.concept_id.nodeValue;
    }
    plan.weight = start.attributes.weight.nodeValue;
    if (start.attributes.score !== undefined) {
      plan.score = start.attributes.score.nodeValue;
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
