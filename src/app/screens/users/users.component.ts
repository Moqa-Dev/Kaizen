import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {UserDTO} from "../../models/users-models/UserDTO";
import {ResultSet} from "../../models/result-set";
import {PageEvent} from "@angular/material/paginator";
import {ViewPopupComponent} from "../../components/view-popup/view-popup.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {Sort} from "@angular/material/sort";
import {ConfirmationPopupComponent} from "../../components/confirmation-popup/confirmation-popup.component";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import Utils from "../../util/Utils";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AddUserDialogComponent} from "./add-user-dialog/add-user-dialog.component";
import {RegisterUserDTO} from "../../models/users-models/RegisterUserDTO";
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { ResetPasswordDTO } from '../../models/users-models/ResetPasswordDTO';
import { UpdateUserDTO } from '../../models/users-models/UpdateUserDTO';
import { SetUserDataDialogComponent } from './set-user-data-dialog/set-user-data-dialog.component';
import { SetUserRolesDialogComponent } from './set-user-roles-dialog/set-user-roles-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent } from 'src/app/components/data-table/data-table/data-table.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    DataTableComponent,
    MatSnackBarModule
  ]
})
export class UsersComponent implements OnInit {

  title: string = 'Users';
  usersResultSet: ResultSet<UserDTO> = new ResultSet<UserDTO>();

  columns: string[] = [];
  displayedColumns: string[] = [];
  rowMenuActions: string[][] = [
    ['info', 'Details'], 
    ['delete', 'Delete'], 
    ['vpn_key', 'ResetPassword'],
    ['contacts', 'EditUserData'],
    ['security', 'SetUserRoles']
  ];

  sort: Sort;

  filtersToApply: any;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {

  }

  getUsers(event: PageEvent) {
    this.usersService.getUsers(event.pageSize, (event.pageSize * event.pageIndex), this.sort, this.filtersToApply).subscribe(response => {
      if (response) {
        this.usersResultSet = response;
        this.usersResultSet.value.forEach(function(item) {
          item.rolesToDisplay = item.roles?.join(', ');
        });
        this.usersResultSet.pageIndex = event.pageIndex;
        this.columns = ['username', 'email', 'rolesToDisplay'];
        this.displayedColumns = ['Username', 'Email', 'Roles'];
      }
    });
  }

  getUser(user: any) {
    this.usersService.getUserById(user.userID).subscribe(response => {
      if (response) {
        response.rolesToDisplay = response.roles?.join(', ');
        this.dialog.open(ViewPopupComponent, {
          width: Utils.isMobile() ? '70%' : '50%',
          maxWidth: Utils.isMobile() ? '70%' : '50%',
          data: {
            title: 'User details',
            username: response.userName,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            team: response.team,
            department: response.department,
            about: response.about,
            phoneNumber: response.phoneNumber,
            roles: response.rolesToDisplay,
          }
        });
      }
    });
  }

  addUser() {
    let dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '50%',
      maxHeight: '90%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let registerUser: RegisterUserDTO = new RegisterUserDTO();
        registerUser.username = response.controls.username.value.trim();
        registerUser.email = response.controls.email.value.trim();
        registerUser.password = response.controls.password.value;
        this.usersService.addUser(registerUser).subscribe(response => {
          if (response) {
            this.refreshPage();
            this.showNotification('User added successfully', NotificationLevel.SUCCESS);
          }
        });
      }
    });
  }


  resetUserPassword(user: any) {
    let dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '30%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let newPassword: ResetPasswordDTO = new ResetPasswordDTO();
        newPassword.newPassword = response.controls.password.value.trim();
        this.usersService.resetPassword(user.userID, newPassword).subscribe(response => {
          this.showNotification('Password reset successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }


  setUserData(user: any) {
    let dialogRef = this.dialog.open(SetUserDataDialogComponent, {
      width: '50%',
      disableClose: true,
      data: user,
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let updateUser: UpdateUserDTO = new UpdateUserDTO();
        updateUser.firstName = response.controls.firstName.value.trim();
        updateUser.lastName = response.controls.lastName.value.trim();
        updateUser.team = response.controls.team.value.trim();
        updateUser.department = response.controls.department.value.trim();
        updateUser.about = response.controls.about.value.trim();
        updateUser.phoneNumber = response.controls.phoneNumber.value.trim();
        this.usersService.setUserData(user.userID, updateUser).subscribe(response => {
          this.showNotification('User Data Updated successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }


  
  setUserRoles(user: any) {
    let dialogRef = this.dialog.open(SetUserRolesDialogComponent, {
      width: '50%',
      disableClose: true,
      data: user,
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        this.usersService.setUserRoles(user.userID, SetUserRolesDialogComponent.selectedRoleIds).subscribe(response => {
          this.refreshPage();
          this.showNotification('User Roles Updated successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  deleteUser(user: any) {
    let confirmDialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '50%',
      data: {
        message: `Are you sure to delete user "${user.username}"?`,
        ok: 'Delete',
        cancel: 'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(action => {
      if (action == 'ok') {
        this.usersService.deleteUser(user.userID).subscribe(() => {
          this.refreshPage();
          this.showNotification('User deleted successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  applyAction(action: string, user: UserDTO) {
    if (action == 'Details') {
      this.getUser(user);
    } else if (action == 'Delete') {
      this.deleteUser(user);
    } else if (action == 'ResetPassword') {
      this.resetUserPassword(user);
    } else if (action == 'EditUserData') {
      this.setUserData(user);
    } else if (action == 'SetUserRoles') {
      this.setUserRoles(user);
    }
  }

  applyFilter(event: any) {
    this.filtersToApply = event;
    this.refreshPage();
  }

  refreshPage() {
    let pageEvent: PageEvent = new PageEvent();
    pageEvent.pageSize = Utils.getCurrentPagination();
    pageEvent.pageIndex = 0;
    this.getUsers(pageEvent);
  }

  showNotification(message: string, level: NotificationLevel) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: [Utils.notificationLevel(level)],
      data: {
        message: message
      }
    });
  }
}
