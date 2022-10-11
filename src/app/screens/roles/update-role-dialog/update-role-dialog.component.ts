import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {noInSpaces} from "../../../validators/noInSpaces";
import Utils from "../../../util/Utils";
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Role } from 'src/app/models/api-models/Role';
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
  selector: 'app-update-role-dialog',
  templateUrl: './update-role-dialog.component.html',
  styleUrls: ['./update-role-dialog.component.scss'],
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
export class UpdateRoleDialogComponent {

  updateForm: FormGroup;
  // workcentersDropdown: WorkCenter[] = [];
  // processTypes: string[] = Object.keys(ProcessType).map(l => {
  //   if (typeof ProcessType[l] === 'string')
  //     return ProcessType[l];
  // }).filter((function (element) {
  //   return element != undefined;
  // }));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Role) {
    this.initForm();
  }

  initForm() {
    this.updateForm = new FormGroup({
      role: new FormControl(this.data.role, [Validators.required, noInSpaces()]),
    });
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.updateForm, field);
  }
}
