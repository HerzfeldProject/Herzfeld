import {Component, HostListener, isDevMode, OnInit, Output} from '@angular/core';

import {Router, ActivatedRoute, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {BaseServiceService} from '../../services/baseService.service';
import {user} from '../../models/user';
import {LoadingScreenService} from '../../services/loading-screen.service';
import {LogObject} from '../../models/logObject';
import {log} from 'util';
// import {AlertService} from '../../services/alert.service';
// import {AuthenticationService} from '../../services/authentication.service';
// import { AlertService, AuthenticationService } from '@/_services';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  userError = false;
  user1 = new user();
  answer = null;
  @Output() isLogin;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private basesrv: BaseServiceService,
    private loadingScreenService: LoadingScreenService
  ) {
  }

  ngOnInit() {
    this.loadingScreenService.stopLoading();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = 'nav';

    this.basesrv.getSubPlanes(function(data) {
      console.log(data);
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.user1.username = this.loginForm.controls.username.value;
    this.user1.password = this.loginForm.controls.password.value;
    this.loadingScreenService.startLoading();
    this.basesrv.authenticate(this.user1, this.callback.bind(this));
  }
  callback(data) {
    // while (data === null) {
    //   this.basesrv.authenticate(this.user1, this.callback.bind(this));
    // }
    this.answer = data;
    this.loadingScreenService.stopLoading();
    if(this.answer !== null) {
          this.answer = this.answer.getElementsByTagName('AuthenticateResult')[0].textContent;
        if (this.answer === 'true') {
          this.isLogin = true;
          // if(!isDevMode()) {
            const loginlog = new LogObject();
          loginlog.patiendID = '00';
          loginlog.method = 'HERTZFELDBI';
          loginlog.conceptId = '00';
          loginlog.state = 'LOGIN';
          loginlog.description = this.user1.username;
            this.basesrv.writeLog(loginlog, function () {
              console.log('log login success');
            });
          // }
          this.router.navigate([this.returnUrl], { queryParams: { user: this.user1.username, si: true } });
        this.loading = true;
      } else {
        this.userError = true;
      }
    }

  }
}
