import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {noInSpaces} from "../../../validators/noInSpaces";
import Utils from "../../../util/Utils";
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-set-user-data-dialog',
  templateUrl: './set-user-data-dialog.component.html',
  styleUrls: ['./set-user-data-dialog.component.scss'],
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
export class SetUserDataDialogComponent {

  updateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserDTO) {
    this.initForm();
  }

  initForm() {
    this.updateForm = new FormGroup({
      firstName: new FormControl(this.data.firstName),
      lastName: new FormControl(this.data.lastName),
      team: new FormControl(this.data.team),
      department: new FormControl(this.data.department),
      about: new FormControl(this.data.about),
      phoneNumber: new FormControl(this.data.phoneNumber)
    });
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.updateForm, field);
  }
}
