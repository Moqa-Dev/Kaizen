import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import {DashboardComponent} from '../../screens/dashboard/dashboard.component';
import {LoginComponent} from "../../screens/login/login.component";
import {AuthGuard} from "../../guards/AuthGuard";
import {RegisterComponent} from "../../screens/register/register.component";
import {UsersComponent} from "../../screens/users/users.component";
import {ProfileComponent} from "../../screens/profile/profile.component";
import { RolesComponent } from '../../screens/roles/roles.component';

export const AdminRoutes: Routes = [
  //{path: '', component: AdminComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/:notFound', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'roles', component: RolesComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  
  {path: '**', redirectTo: 'dashboard/NotFound'},
];

