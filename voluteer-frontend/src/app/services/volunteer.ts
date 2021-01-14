import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "./data.services";

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  constructor(
    private ds: DataService
  ) {}

  getVolunteerDetails(volunteer): Observable<any> {
    return this.ds.get(`auth/staff/${volunteer}/userdata`);
  }

  uploadVolunteerPhoto(id, file): Observable<any> {
    return this.ds.post(`auth/staff/${id}/add-volunteer-photo`, file);
  }

  getVolunteerTable(): Observable<any> {
    return this.ds.get('auth/volunteer');
  }

  postEnrollment(volunteer, data): Observable<any> {
    return this.ds.post(`auth/staff/${volunteer}/update-volunteer`, data);
  }

}
