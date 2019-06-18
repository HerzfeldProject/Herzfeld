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
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  entryComponents: []
})
export class NavComponent implements OnInit {
  @Input() serched;
  @Input() mainRequest: DataRequest;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(private breakpointObserver: BreakpointObserver,
               private loadingScreenService: LoadingScreenService, private dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log(this.mainRequest);
  }
  }

