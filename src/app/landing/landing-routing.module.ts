import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

export const LandingRoutes: Routes = [
  {path: 'landing', component: LandingComponent},
  {path: '**', redirectTo: 'landing'}
];

