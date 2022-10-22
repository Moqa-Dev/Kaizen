import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ALLROUTES: RouteInfo[] = [
  {path: '/admin/dashboard', title: 'Dashboard', icon: 'dashboard', class: ''},
  {path: '/admin/topics', title: 'Topics', icon: 'mail', class: ''},
  {path: '/admin/posts', title: 'Posts', icon: 'subject', class: ''},
  // {path: '/report', title: 'Daily Report', icon: 'flag', class: ''},
  // {path: '/alerts', title: 'Alerts', icon: 'warning', class: ''},
  // {path: '/transactions', title: 'Transactions', icon: 'assignment_turned_in', class: ''},
  // {path: '/processes', title: 'Processes', icon: 'memory', class: ''},
  // {path: '/rules', title: 'Rules', icon: 'sync_problem', class: ''},
  // {path: '/workcenters', title: 'Work Centers', icon: 'work', class: ''},
  // {path: '/departments', title: 'Departments', icon: 'store', class: ''},
  {path: '/admin/users', title: 'Users', icon: 'people', class: ''},
  {path: '/admin/roles', title: 'Roles', icon: 'security', class: ''},
];

export const ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    RouterModule,
    MatDialogModule,
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  @Output() hideSidebarEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
    this.menuItems = ALLROUTES.filter(menuItem => menuItem);
    //TODO: Routes by permission
    
    // this.usersService.getUserPermissions().subscribe((response: { value: string[]; }) => {
    //   if (response) {
    //     let permissions = response.value.join(', ').toUpperCase();
    //     ALLROUTES.forEach(element => {
    //       if(permissions.includes(element.title.replace(' ','').toUpperCase()))
    //         ROUTES.push(element);
    //     });
    //     this.menuItems = ROUTES.filter(menuItem => menuItem);
    //   }
    // });
    
  }

  hideSidebar() {
    if ($(window).width() <= 1200)
      this.hideSidebarEvent.emit(true);
  }
}
