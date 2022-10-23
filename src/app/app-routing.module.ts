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
    path: 'angular',
    children: [{
      path: '',
      loadChildren: () => import('./layouts/gs/gs.module').then(x => x.GSModule)
    }]
  }, {
    path: 'posts',
    children: [{
      path: '',
      loadChildren: () => import('./layouts/public/public.module').then(x => x.PublicModule)
    }]
  }, {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () => import('./layouts/admin/admin.module').then(x => x.AdminModule)
  }, {
    path: '**',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
