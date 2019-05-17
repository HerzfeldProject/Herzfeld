import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DataRequest} from '../models/dataRequest';

@Injectable({
  providedIn: 'root'
})
export class SharedRequestService {

  request = new BehaviorSubject(new DataRequest());
  currentRequest = this.request.asObservable();
  constructor() { }
  changeRequest(req) {
    this.request.next(req);
  }
}
