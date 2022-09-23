import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LandingRoutes } from './landing-routing.module';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LandingRoutes),
  ],
  providers: []
})
export class LandingModule { }
