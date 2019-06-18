import {Component, Input, OnInit} from '@angular/core';
import { IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import {ObjectToChartService} from './services/object-to-chart.service';
import {BaseServiceService} from './services/baseService.service';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ObjectToChartService, BaseServiceService],
  entryComponents: []
})
export class AppComponent implements OnInit {
  title = 'Herzfeld';
  @Input() isLogin;

  constructor(private route: ActivatedRoute,
              private router: Router){}
    ngOnInit() {
    }
    logout(){
      this.isLogin = false;
      this.router.navigate(['login']);
    }
}
