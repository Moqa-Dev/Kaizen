import {NgModule} from '@angular/core';

import {ViewPopupComponent} from './view-popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  imports: [
    MatDialogModule,
    MatDividerModule,
    
  ],
  declarations: [
    ViewPopupComponent,
  ],
  exports: [
  ]
})
export class ViewPopupModule {
}
