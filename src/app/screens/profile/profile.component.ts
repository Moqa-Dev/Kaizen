import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import Utils from "../../util/Utils";
import {UsersService} from "../../services/users.service";
import {UserDTO} from "../../models/users-models/UserDTO";
import {UpdateUserDTO} from "../../models/users-models/UpdateUserDTO";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {UpdatePasswordDTO} from "../../models/users-models/UpdatePasswordDTO";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent } from 'src/app/components/data-table/data-table/data-table.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
    MatSnackBarModule,
    MatIconModule
  ]
})
export class ProfileComponent implements OnInit {

  currentUser: UserDTO;

  hideOld: boolean = true;
  hideNew: boolean = true;
  updateUserForm: FormGroup;
  updatePasswordForm: FormGroup;

  editProfileMode: boolean = false;
  editPasswordMode: boolean = false;

  constructor(
    private titleService: Title,
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Kaizen - Profile');
    this.getUserData();
  }

  initProfileForm() {
    this.updateUserForm = new FormGroup({
      firstName: new FormControl({value: this.currentUser.firstName, disabled: !this.editProfileMode}),
      lastName: new FormControl({value: this.currentUser.lastName, disabled: !this.editProfileMode}),
      team: new FormControl({value: this.currentUser.team, disabled: !this.editProfileMode}),
      department: new FormControl({value: this.currentUser.department, disabled: !this.editProfileMode}),
      about: new FormControl({value: this.currentUser.about, disabled: !this.editProfileMode}),
      phoneNumber: new FormControl({value: this.currentUser.phoneNumber, disabled: !this.editProfileMode})
    });
  }

  initPasswordForm() {
    this.updatePasswordForm = new FormGroup({
      username: new FormControl({value: this.currentUser.userName, disabled: true}, [Validators.required]),
      email: new FormControl({value: this.currentUser.email, disabled: true}, [Validators.required]),
      oldPassword: new FormControl({value: '', disabled: !this.editPasswordMode}, [Validators.required]),
      newPassword: new FormControl({value: '', disabled: !this.editPasswordMode}, [Validators.required])
    });
  }

  getUserData() {
    this.usersService.getCurrentUser().subscribe(response => {
      if (response) {
        this.currentUser = response;
        this.initProfileForm();
        this.initPasswordForm();
      }
    });
  }

  updateUserData() {
    let updateUser: UpdateUserDTO = new UpdateUserDTO();
    updateUser.firstName = this.updateUserForm.controls.firstName.value.trim();
    updateUser.lastName = this.updateUserForm.controls.lastName.value.trim();
    updateUser.team = this.updateUserForm.controls.team.value.trim();
    updateUser.department = this.updateUserForm.controls.department.value.trim();
    updateUser.about = this.updateUserForm.controls.about.value.trim();
    updateUser.phoneNumber = this.updateUserForm.controls.phoneNumber.value.trim();
    this.usersService.updateUser(updateUser).subscribe(() => {
      this.getUserData();
      this.editProfileMode = false;
      this.showNotification('User Updated Successfully', NotificationLevel.SUCCESS);
    });
  }

  updateUserPassword() {
    let updatePassword: UpdatePasswordDTO = new UpdatePasswordDTO();
    updatePassword.oldPassword = this.updatePasswordForm.controls.oldPassword.value;
    updatePassword.newPassword = this.updatePasswordForm.controls.newPassword.value;
    this.usersService.updatePassword(updatePassword).subscribe(() => {
      this.editPasswordMode = false;
      this.showNotification('Password updated successfully', NotificationLevel.SUCCESS);
      this.initPasswordForm();
    });
  }

  enableUpdateProfile() {
    this.editProfileMode = true;
    this.initProfileForm();
  }

  disableUpdateProfile() {
    this.editProfileMode = false;
    this.initProfileForm();
  }

  enableUpdatePassword() {
    this.editPasswordMode = true;
    this.initPasswordForm();
  }

  disableUpdatePassword() {
    this.editPasswordMode = false;
    this.initPasswordForm();
  }

  getErrorMessage(field: string): string {
    if (this.updateUserForm.contains(field))
      return Utils.getErrorMessage(this.updateUserForm, field);
    else
      return Utils.getErrorMessage(this.updatePasswordForm, field);
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
