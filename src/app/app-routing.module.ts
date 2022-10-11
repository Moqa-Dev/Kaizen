import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './layouts/admin/admin.component';
import { LandingComponent } from './layouts/landing/landing.component';
import { ThemeComponent } from './layouts/theme/theme.component';

const routes: Routes = [
  {
    path: 'landing',
    children: [{
      path: '',
      loadChildren: () => import('./layouts/landing/landing.module').then(x => x.LandingModule)
    }]
  }, {
    path: 'theme',
    children: [{
      path: '',
      loadChildren: () => import('./layouts/theme/theme.module').then(x => x.ThemeModule)
    }]
  }, {
    path: 'admin',
    component: AdminComponent, //TODO: Remove This, added to load components inside admin layout, children was overriding layout
    loadChildren: () => import('./layouts/admin/admin.module').then(x => x.AdminModule)
  }, {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
