import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
  ) {}

  get(url): Observable<any> {
    return this.http.get(`${environment.apiUrl}${url}`);
  }

  post(url, data): Observable<any> {
    return this.http.post(`${environment.apiUrl}${url}`, data);
  }

  put(url, data): Observable<any> {
    return this.http.put(`${environment.apiUrl}${url}`, data);
  }

  delete(url): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${url}`);
  }
}
