import {Component, Inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import Utils from "../../../util/Utils";
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Role } from 'src/app/models/api-models/Role';
import { RolesService } from 'src/app/services/roles.service';
import { UserDTO } from 'src/app/models/users-models/UserDTO';
import { UsersService } from 'src/app/services/users.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent } from 'src/app/components/data-table/data-table/data-table.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'manage-role-users-dialog',
  templateUrl: './manage-role-users-dialog.component.html',
  styleUrls: ['./manage-role-users-dialog.component.scss'],
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
    MatIconModule,
  ]
})
export class ManageRoleUsersDialogComponent {

  updateForm: FormGroup;
  users: UserDTO[] = [];
  
  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Role) {
    this.getUsers();
  }

  get usersFormArray() {
    return this.updateForm?.controls.users as FormArray;
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      users: new FormArray([])
    });
    this.users.forEach(user => this.usersFormArray.push(
      new FormControl(this.data.users.map(x=> x.username).includes(user.username))));
  }

  getUsers() {
    this.usersService.geItemsForDropdown().subscribe(response => {
      if (response.value.length > 0) {
        this.users = response.value;
        this.initForm();
      }
    });
  }

  public static selectedUserIds: string[] = [];
  submit() {
    ManageRoleUsersDialogComponent.selectedUserIds = this.updateForm.value.users
      .map((checked, i) => checked ? this.users[i].userID : null)
      .filter(v => v !== null);
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.updateForm, field);
  }
}
