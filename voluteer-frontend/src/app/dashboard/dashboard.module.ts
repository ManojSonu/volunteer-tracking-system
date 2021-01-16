import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebcamComponent } from './webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent, WebcamComponent],
  imports: [
    CommonModule,
    FormsModule,
    WebcamModule,
    RouterModule.forChild(routes),
  ]
})
export class DashboardModule { }
