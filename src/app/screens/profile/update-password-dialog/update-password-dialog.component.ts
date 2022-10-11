import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NotificationLevel} from "../../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../../components/snack-bar/snack-bar.component";
import Utils from "../../../util/Utils";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {UpdatePasswordDTO} from "../../../models/users-models/UpdatePasswordDTO";
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
  selector: 'app-update-password-dialog',
  templateUrl: './update-password-dialog.component.html',
  styleUrls: ['./update-password-dialog.component.scss'],
  standalone: true,
  imports:[
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
export class UpdatePasswordDialogComponent {

  hideOld: boolean = true;
  hideNew: boolean = true;
  updatePasswordForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private dialogRef: MatDialogRef<UpdatePasswordDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  initForm() {
    this.updatePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required])
    });
  }

  updatePassword() {
    let updatePassword: UpdatePasswordDTO = new UpdatePasswordDTO();
    updatePassword.oldPassword = this.updatePasswordForm.controls.oldPassword.value;
    updatePassword.newPassword = this.updatePasswordForm.controls.newPassword.value;
    this.usersService.updatePassword(updatePassword).subscribe(() => {
      this.showNotification('Password updated successfully', NotificationLevel.SUCCESS);
      this.dialogRef.close();
    });
  }

  showNotification(message: string, level: NotificationLevel) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: [Utils.notificationLevel(level)],
      data: {
        message: message
      }
    });
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.updatePasswordForm, field);
  }
}
