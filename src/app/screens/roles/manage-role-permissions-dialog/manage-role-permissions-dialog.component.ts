import {Component, Inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import Utils from "../../../util/Utils";
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Role } from '../../../models/api-models/Role';
import { RolesService } from '../../../services/roles.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent } from 'src/app/components/data-table/data-table/data-table.component';

@Component({
  selector: 'app-manage-role-permissions-dialog',
  templateUrl: './manage-role-permissions-dialog.component.html',
  styleUrls: ['./manage-role-permissions-dialog.component.scss'],
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
    DataTableComponent
  ]
})
export class ManageRolePermissionssDialogComponent {

  updateForm: FormGroup;
  permissions: string[] = [];
  
  constructor(
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Role) {
    this.getpermissionss();
  }

  get permissionsFormArray() {
    return this.updateForm?.controls.permissions as FormArray;
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      permissions: new FormArray([])
    });
    this.permissions.forEach(permission => this.permissionsFormArray.push(new FormControl(this.data.permissions.includes(permission))));
  }

  getpermissionss() {
    this.rolesService.getAllPermissions().subscribe(response => {
      if (response.value.length > 0) {
        this.permissions = response.value;
        this.initForm();
      }
    });
  }

  public static selectedPermissions: string[] = [];
  submit() {
    ManageRolePermissionssDialogComponent.selectedPermissions = this.updateForm.value.permissions
      .map((checked, i) => checked ? this.permissions[i] : null)
      .filter(v => v !== null);
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.updateForm, field);
  }
}
