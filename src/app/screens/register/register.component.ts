import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RegisterUserDTO} from "../../models/users-models/RegisterUserDTO";
import {UsersService} from "../../services/users.service";
import {Title} from "@angular/platform-browser";
import Utils from "../../util/Utils";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
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
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
    MatCardModule,
    MatIconModule,
    DataTableComponent,
    MatSnackBarModule
  ]
})
export class RegisterComponent implements OnInit {

  hidePassword: boolean = true;
  registerForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private titleService: Title,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('MOQA - Register');
    this.initForm();
  }

  initForm() {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required])
    });
  }

  register() {
    if (this.registerForm.valid) {
      let user: RegisterUserDTO = new RegisterUserDTO();
      user.username = this.registerForm.controls.username.value;
      user.password = this.registerForm.controls.password.value;
      user.email = this.registerForm.controls.email.value;

      this.usersService.addUser(user).subscribe(response => {
        if (response) {
          this.showNotification('User Added Successfully', NotificationLevel.SUCCESS);
        }
      });
    }
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.registerForm, field);
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
