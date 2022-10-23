import { Routes } from '@angular/router';
import { GSComponent } from './gs.component';

export const GSRoutes: Routes = [
  {path: '', component: GSComponent},
  {path: '**', redirectTo: ''}
];

