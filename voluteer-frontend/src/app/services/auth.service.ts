import { Injectable } from '@angular/core';
import { DataService } from './data.services';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser = new BehaviorSubject<any>('');
  isAdminUser = new BehaviorSubject<any>(false);
  jwtHelper = new JwtHelperService();
  token: string =  localStorage.token;

  constructor(
    private router: Router,
    private ds: DataService
  ) {
    this.currentUser.subscribe(user => {
      if(user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', this.token);
      }
    });
  }

  login(data): Observable<any> {
    return this.ds.post('auth/login', data).pipe(
      map(res => {
        if (res.success) {
          localStorage.isLoggedIn = true;
          this.token = res.token;
          const decodedToken = this.jwtHelper.decodeToken(this.token);
          this.currentUser.next(decodedToken.user);
          // this.isAdminUser.next(this.isAdmin());
          return res.success;
        }
        return res;
      })
    );
  }

  register(data): Observable<any> {
    return this.ds.post('auth/register', data);
  }

  updateUser(data): Observable<any> {
    return this.ds.put(`users/${data._id}`, data);
  }

  removeUser(data): Observable<any> {
    return this.ds.delete(`users/${data._id}`);
  }

  logout() {
    this.clearStorage();
    this.router.navigate(['login']);
  }

  clearStorage() {
    localStorage.clear();
    this.token = null;
  }

  isLoggedIn() {
    return localStorage.getItem('isLoggedIn');
  }

  isAdmin() {
    const type = this.jwtHelper.decodeToken(this.token).user.type;
    return  (type === 'admin' || type === 'staff');
  }

  getCurrentUser() {
    if(this.token) {
      return this.jwtHelper.decodeToken(this.token).user;
    }
    return null;
  }

  isTokenAlive() {
    const token = (this.token && this.token !== 'undefined')  ? this.token : '';
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
}
