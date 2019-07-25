import {Component, Input, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {DataRequest} from '../models/dataRequest';
import {MatDialog} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoadingScreenService} from '../services/loading-screen.service';
import {ProtocolModalComponent} from '../protocol-modal/protocol-modal.component';
import {ActivatedRoute, Event, Router , NavigationCancel, NavigationEnd, NavigationError, NavigationStart} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  entryComponents: []
})
export class NavComponent implements OnInit {
  @Input() serched;
  @Input() mainRequest: DataRequest;
  @Input() username: string;
  // ShowLoad = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,  private loadingScreenService: LoadingScreenService, private dialog: MatDialog, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.username = params.user;
    });
  }

  ngOnInit(): void {
    console.log(this.mainRequest);
    // this.router.navigate(['admission']);
  }
  startNav(){
    this.loadingScreenService.startLoading();
  }
  }

