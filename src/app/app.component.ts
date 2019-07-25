import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import {ObjectToChartService} from './services/object-to-chart.service';
import {BaseServiceService} from './services/baseService.service';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Event} from '@angular/router';
import {LogObject} from './models/logObject';

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
              public router: Router, private basesrv: BaseServiceService){
  }
    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.username =  params.user;
      });
    }
    logout(){
      this.isLogin = false;
      const logoutlog = new LogObject();
      logoutlog.conceptId = '00';
      logoutlog.method = 'HERTZFELDBI';
      logoutlog.state = 'Logout';
      // @ts-ignore
      logoutlog.patiendID = this.route.children[0].queryParams.value.user;
      // @ts-ignore
      logoutlog.description = this.route.children[0].queryParams.value.user;
      this.basesrv.writeLog(logoutlog, function () {
        console.log('logout success');
      });
      this.router.navigate(['login'], {queryParams: {user: 'non'}});
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
