import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin/admin.module').then(x => x.AdminModule)
    }]
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
