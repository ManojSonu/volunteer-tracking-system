import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { VolunteerService } from '../services/volunteer';
import * as html2pdf from 'html2pdf.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  volunteerData: any[] = [];
  volunteerInfo: any;
  isAdmin: boolean = false;
  isAdminUser$: Subscription;
  currentUser: any;
  searchVolunteer: any;
  dataFetched: boolean = false;
  blockedDays: number;
  currentDate = new Date();
  dateOfParticipaion: Date;
  daysToBeBlocked: number = 90;
  lastSampleCollectionDate: Date;
  errorMessage: string;

  @ViewChild('downloadContainer', { static: false }) downloadContainer: ElementRef;

  constructor(
    private auth: AuthService,
    private vs: VolunteerService
  ) { }

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    // console.log('this.currentUser$', this.currentUser);
    this.isAdminUser$ = this.auth.isAdminUser.subscribe(res => {
      this.isAdmin = res;
    });
    if (this.currentUser.type === 'volunteer') {
      this.volunteerInfo = {
        type: 'volunteer'
      }
      this.vs.getVolunteerTable().subscribe(
        res => {
          this.volunteerData = this.setImgUrl(res.data);
          this.dataFetched = true;
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.isAdminUser$) {
      this.isAdminUser$.unsubscribe();
    }
  }

  setImgUrl(data) {
    return data.map(itm => {
      console.log('this.volunteerData', itm);
      itm.imgUrl = environment.imagesUrl + itm.volunteerPhoto;
      return itm;
    });
  }

  getVolunteerInfo() {
    this.errorMessage = null;
    this.vs.getVolunteerDetails(this.searchVolunteer).subscribe(
      res => {
        if (res.user) {
          this.volunteerInfo = res.user;
          this.volunteerData = this.setImgUrl(res.data);
          this.blockedDays = res.enrollBlockedDays;
          this.dataFetched = true;
          this.volunteerInfo.volunteerPhoto = res.data[0] && res.data[0].volunteerPhoto;
        } else {
          this.errorMessage = res.message;
        }
      }
    );
  }

  addEnrollment() {
    const data = {
      dateOfParticipaion: this.dateOfParticipaion,
      daysToBeBlocked: this.daysToBeBlocked,
      lastSampleCollectionDate: this.lastSampleCollectionDate,
      volunteerPhoto: this.volunteerInfo.volunteerPhoto
    };
    this.vs.postEnrollment(this.searchVolunteer, data).subscribe(
      res => {
        this.volunteerData.unshift(this.setImgUrl([res.data])[0]);
        this.blockedDays = res.enrollBlockedDays;
        this.dateOfParticipaion = null;
        this.daysToBeBlocked = 90;
        this.lastSampleCollectionDate = null;
      });
  }

  downloadPdf() {
    let options = {
      margin: 1,
      filename: 'report.pdf',
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: {
        orientation: 'portrait',
        unit: 'cm',
        format: 'a4'
      }
    };
    html2pdf().set(options).from(this.downloadContainer.nativeElement).save();
  }

  savePicture(webcamImg) {
    const file = this.dataURLtoBlob(webcamImg.imageAsDataUrl);
    const formData = new FormData();
    formData.append('file', file, this.searchVolunteer);
    this.vs.uploadVolunteerPhoto(this.searchVolunteer, formData).subscribe(res => {
      if (res) {
        this.volunteerInfo.volunteerPhoto = res.data.volunteerPhoto;
      }
    });
  }

  dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

}
