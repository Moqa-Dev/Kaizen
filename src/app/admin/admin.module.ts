import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminRoutes } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButton, MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule.forChild(AdminRoutes),
  ],
  providers: []
})
export class AdminModule { }
