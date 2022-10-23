import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GSRoutes } from './gs-routing.module';
import { GSComponent } from './gs.component';

@NgModule({
  declarations: [
    GSComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(GSRoutes),
  ],
  providers: []
})
export class GSModule { }
