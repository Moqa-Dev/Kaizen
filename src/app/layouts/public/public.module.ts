import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF, CommonModule} from '@angular/common';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from 'src/app/interceptors/interceptor';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PublicComponent } from './public.component';
import { PublicRoutes } from './public-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MarkdownModule } from 'ngx-markdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    PublicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PublicRoutes),
    FooterComponent,
    NavbarComponent,
    MatSnackBarModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    InfiniteScrollModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: window['base-href']},
    {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    }
  ]
})
export class PublicModule { }
