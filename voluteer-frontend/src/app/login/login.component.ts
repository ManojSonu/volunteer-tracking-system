import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: string = 'dashboard';
  showError: boolean = false;
  error: string;
  inlineLoader: boolean = false;
  disableSubmit = true;

  loginForm = this.fb.group({
    phone: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl;
      localStorage.clear();
    });
    this.loginForm.valueChanges.subscribe(val => {
      this.showError = false;
      this.disableSubmit = this.loginForm.invalid;
    });
  }

  login() {
    this.inlineLoader = true;
    this.auth.login(this.loginForm.value).subscribe(res => {
      if (res) {
        // const url = (this.returnUrl && this.returnUrl.indexOf('register') > -1 && !this.auth.isAdmin()) ? '/dashboard' : this.returnUrl;
        this.router.navigateByUrl('/dashboard');
      }
      this.inlineLoader = false;
    },
      err => {
        const errMsg = err.error && err.error.errors && err.error.errors.message || err.statusText;
        this.error = errMsg;
        this.showError = true;
        this.inlineLoader = false;
      });
  }

}
