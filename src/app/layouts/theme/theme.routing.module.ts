import { Routes } from '@angular/router';
import { ThemeComponent } from './theme.component';

export const ThemeRoutes: Routes = [
  {path: '', component: ThemeComponent},
  {path: '**', redirectTo: ''}
];

