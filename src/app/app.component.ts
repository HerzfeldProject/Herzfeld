import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import {ObjectToChartService} from './services/object-to-chart.service';
import {BaseServiceService} from './services/baseService.service';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Event} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ObjectToChartService, BaseServiceService],
  entryComponents: []
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Herzfeld';
  @Input() isLogin;
  username: string;

  constructor(private route: ActivatedRoute,
              public router: Router){
  }
    ngOnInit() {
    }
    logout(){
      this.isLogin = false;
      this.router.navigate(['login'], {queryParams: {user: 'eee'}});
    }
  ngAfterViewInit() {
    // this.router.events
    //   .subscribe((event) => {
    //     if (event instanceof NavigationStart) {
    //       this.ShowLoad = true;
    //     } else if (
    //       event instanceof NavigationEnd ||
    //       event instanceof NavigationCancel
    //     ) {
    //       this.ShowLoad = false;
    //     }
    //   });
  }
}
