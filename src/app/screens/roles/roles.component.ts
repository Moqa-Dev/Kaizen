import {Component, OnInit} from '@angular/core';
import {ResultSet} from "../../models/result-set";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {PageEvent} from "@angular/material/paginator";
import {ViewPopupComponent} from "../../components/view-popup/view-popup.component";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import Utils from "../../util/Utils";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {Filter} from "../../models/filter";
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopupComponent } from '../../components/confirmation-popup/confirmation-popup.component';
import { Role } from '../../models/api-models/Role';
import { RolesService } from '../../services/roles.service';
import { UpdateRoleDTO } from '../../models/api-models/dtos/UpdateRoleDTO';
import { UpdateRoleDialogComponent } from './update-role-dialog/update-role-dialog.component';
import { AddRoleDialogComponent } from './add-role-dialog/add-role-dialog.component';
import { ManageRoleUsersDialogComponent } from './manage-role-users-dialog/manage-role-users-dialog.component';
import { ManageRolePermissionssDialogComponent } from './manage-role-permissions-dialog/manage-role-permissions-dialog.component';
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
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
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
export class RolesComponent {

  title: string = 'Roles';
  itemsResultSet: ResultSet<Role> = new ResultSet<Role>();
  exportItemsResultSet: ResultSet<Role> = new ResultSet<Role>();

  columns: string[] = [];
  displayedColumns: string[] = [];
  rowMenuActions: string[][] = [
    ['info', 'Details'],  
    ['edit', 'Update'], 
    ['delete', 'Delete'],
    ['people', 'ManageUsers'],
    ['phonelink_lock', 'ManagePermissions']
  ];

  itemsForExport: any[] = [];

  sort: Sort;

  filters: Filter[] = [];

  filtersToApply: any;

  constructor(
    private rolesService: RolesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
  }

  getAll(event: PageEvent) {
    this.rolesService.getAll(event.pageSize, (event.pageSize * event.pageIndex), this.sort, this.filtersToApply).subscribe(response => {
      if (response) {
        this.itemsResultSet = response;
        this.itemsResultSet.value.forEach(function(item) {
        });
        this.itemsResultSet.pageIndex = event.pageIndex;
        this.columns = ['roleID', 'role'];
        this.displayedColumns = ['Id', 'Role'];
      }
    });
  }

  getById(item: any) {
    this.rolesService.getById(item.roleID).subscribe(response => {
      if (response) {
        this.dialog.open(ViewPopupComponent, {
          width: '50%',
          maxWidth: '50%',
          data: {
            title: 'Role details',
            Role: response.role,
            Id: response.roleID,
            Permissions: response.permissions?.join(', '),
            Users: response.users.map(x=> x.username).join(', '),
          }
        });
      }
    });
  }

  applyAction(action: string, item: Role) {
    if (action == 'Details') {
      this.getById(item);
    } else if (action == 'Update') {
      this.updateItem(item);
    } else if (action == 'Delete') {
      this.deleteItem(item);
    } else if (action == 'ManageUsers') {
      this.setRoleUsers(item);
    } else if (action == 'ManagePermissions') {
      this.setRolePermissions(item);
    }
  }


  deleteItem(originalItem: any) {
    let confirmDialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      data: {
        message: `Are you sure to delete "${originalItem.role}"?`,
        ok: 'Delete',
        cancel: 'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(action => {
      if (action == 'ok') {
        this.rolesService.deleteItem(originalItem.roleID).subscribe(() => {
          this.refreshPage();
          this.showNotification('Item deleted successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  AddItem() {
    let dialogRef = this.dialog.open(AddRoleDialogComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let item: UpdateRoleDTO = new UpdateRoleDTO();
        item.role = response.controls.role.value;
        this.rolesService.AddItem(item).subscribe(response => {
          if (response) {
            this.refreshPage();
            this.showNotification('Item added successfully', NotificationLevel.SUCCESS);
          }
        });
      }
    });
  }

  updateItem(originalItem: any) {
    let dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      disableClose: true,
      data: originalItem
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let item: UpdateRoleDTO = new UpdateRoleDTO();
        item.role = response.controls.role.value;
        this.rolesService.updateItem(originalItem.roleID, item).subscribe(() => {
          this.refreshPage();
          this.showNotification('item updated successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }


  
  setRoleUsers(role: any) {
    let dialogRef = this.dialog.open(ManageRoleUsersDialogComponent, {
      width: '50%',
      disableClose: true,
      data: role,
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        this.rolesService.setRoleUsers(role.roleID, ManageRoleUsersDialogComponent.selectedUserIds).subscribe(response => {
          this.refreshPage();
          this.showNotification('Role Users Updated successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  setRolePermissions(role: any) {
    let dialogRef = this.dialog.open(ManageRolePermissionssDialogComponent, {
      width: '50%',
      disableClose: true,
      data: role,
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        this.rolesService.setRolePermissions(role.roleID, ManageRolePermissionssDialogComponent.selectedPermissions).subscribe(response => {
          this.refreshPage();
          this.showNotification('Role Permissions Updated successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  applyFilter(event: any) {
    this.filtersToApply = event;
    this.refreshPage();
  }

  refreshPage() {
    let pageEvent: PageEvent = new PageEvent();
    pageEvent.pageSize = Utils.getCurrentPagination();
    pageEvent.pageIndex = 0;
    this.getAll(pageEvent);
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
