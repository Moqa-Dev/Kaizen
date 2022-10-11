import {Component, Inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import Utils from "../../../util/Utils";
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Role } from '../../../models/api-models/Role';
import { RolesService } from '../../../services/roles.service';
import { UserDTO } from '../../../models/users-models/UserDTO';
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
  selector: 'app-set-user-roles-dialog',
  templateUrl: './set-user-roles-dialog.component.html',
  styleUrls: ['./set-user-roles-dialog.component.scss'],
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
export class SetUserRolesDialogComponent {

  updateForm: FormGroup;
  roles: Role[] = [];
  
  constructor(
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO) {
    this.getRoles();
  }

  get rolesFormArray() {
    return this.updateForm?.controls.roles as FormArray;
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      roles: new FormArray([])
    });
    this.roles.forEach(role => this.rolesFormArray.push(new FormControl(this.data.roles.includes(role.role))));
  }

  getRoles() {
    this.rolesService.geItemsForDropdown().subscribe(response => {
      if (response.value.length > 0) {
        this.roles = response.value;
        this.initForm();
      }
    });
  }

  public static selectedRoleIds: string[] = [];
  submit() {
    SetUserRolesDialogComponent.selectedRoleIds = this.updateForm.value.roles
      .map((checked, i) => checked ? this.roles[i].roleID : null)
      .filter(v => v !== null);
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.updateForm, field);
  }
}
