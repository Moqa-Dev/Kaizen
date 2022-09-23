import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminRoutes } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule.forChild(AdminRoutes),
  ],
  providers: []
})
export class AdminModule { }
