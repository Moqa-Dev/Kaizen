import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginUserDTO} from "../../models/users-models/LoginUserDTO";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import Utils from "../../util/Utils";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
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
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    MatCheckboxModule,
    MatCardModule,
    DataTableComponent,
    MatSnackBarModule
  ]
})
export class LoginComponent implements OnInit {

  hidePassword: boolean = true;
  loginForm: FormGroup;

  rememberMe: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private router: Router,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.titleService.setTitle('MOQA - Login');
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  login() {
    if (this.loginForm.valid) {
      let user: LoginUserDTO = new LoginUserDTO();
      user.username = this.loginForm.controls.username.value;
      user.password = this.loginForm.controls.password.value;

      this.loginService.login(user).subscribe(response => {
        if (response && response.token) {
          localStorage.setItem('rememberMe', String(this.rememberMe));
          localStorage.setItem('token', response.token);
          this.router.navigate(['dashboard']);
        }
      });
    }
  }
  changeRememberMe(event: MatCheckboxChange) {
    this.rememberMe = event.checked;
  }

  showNotification(error: string, level: NotificationLevel) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: [Utils.notificationLevel(level)],
      data: {
        message: error
      }
    });
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.loginForm, field);
  }
}
