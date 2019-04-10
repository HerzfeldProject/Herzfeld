import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdmissionDashboardService {

  constructor() { }

  getTimeBaseData(request) {
    // send request and get tuples by concept
    // send to calcTotal.. and calcCon..
    // send to intervals if needed -  another function beacuse it's drill down
  }

  getPatientsBaseData(request) {
    // send request and get tuples by concept
    // send to calcTotal.. and calcCon..
    // send to intervals if needed
  }

  calculateTotalCompliance() {
    // get tuple scores and calculate
    // return total score
    return 90;
  }
  calculateConceptsCompliance() {
    // get tuple scores
    // return tuple scores
  }
  calculateIntervalesForAllPatients() {
    // get all request and send to getData-use get data from values.service
    // save intervales
  }
  calculateIntervalesForPatient() {
    // get all request and send to getData-use get data from values.service
    // save intervales
  }
}
