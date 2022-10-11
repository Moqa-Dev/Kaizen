import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {AdminRoutes} from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AuthGuard } from 'src/app/guards/AuthGuard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from 'src/app/interceptors/interceptor';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { DashboardComponent } from 'src/app/screens/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    MatSnackBarModule,
  ],
  providers: [
    AuthGuard,
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
export class AdminModule { }
