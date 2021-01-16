import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  showError: boolean = false;
  error: string;
  inlineLoader: boolean = false;
  disableSubmit = true;
  isAdmin = false;
  isStaff = false;
  hideLogin = false;
  currentUser: any;

  registerForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    aadhar: ['', Validators.required],
    password: ['', Validators.required],
    address: ['', Validators.required],
    type: 'volunteer'
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(val => {
      this.showError = false;
      this.disableSubmit = this.registerForm.invalid;
    });
    this.currentUser = this.auth.getCurrentUser();
    console.log(this.currentUser);
    if (this.currentUser) {
      if (this.currentUser.type === 'staff') {
        this.isAdmin = false;
        this.isStaff = true;
      } else if (this.currentUser.type === 'admin') {
        this.isAdmin = true;
        this.isStaff = true;
      }
    }
  }

  register() {
    this.inlineLoader = true;
    console.log('RegisterForm: ', this.registerForm.value)
    this.auth.register(this.registerForm.value).subscribe(res => {
      if (res) {
        this.router.navigateByUrl('/login');
      }
    },
      err => {
        const errMsg = err.error && err.error.errors && err.error.errors.message || err.statusText;
        this.error = errMsg;
        this.showError = true;
        this.inlineLoader = false;
      });
  }

}
