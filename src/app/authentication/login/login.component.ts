import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {BaseServiceService} from '../../services/baseService.service';
import {user} from '../../models/user';
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private basesrv: BaseServiceService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = 'nav';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.user1.username = this.loginForm.controls.username.value;
    this.user1.password = this.loginForm.controls.password.value;
    this.basesrv.authenticate(this.user1, data => {
      if (data === 'true') {
        this.router.navigate([this.returnUrl])
        this.loading = true;
      } else {
        console.log('errorrrr');
        this.userError = true;
      }
    });
  }
}
