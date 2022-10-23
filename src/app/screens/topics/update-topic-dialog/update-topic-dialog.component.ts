import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {noInSpaces} from "../../../validators/noInSpaces";
import Utils from "../../../util/Utils";
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Topic } from 'src/app/models/api-models/Topic';
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
import { UpdateTopicDTO } from 'src/app/models/api-models/dtos/UpdateTopicDTO';

@Component({
  selector: 'app-update-topic-dialog',
  templateUrl: './update-topic-dialog.component.html',
  styleUrls: ['./update-topic-dialog.component.scss'],
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
export class UpdateTopicDialogComponent {

  updateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UpdateTopicDTO) {
    this.initForm();
  }

  initForm() {
    this.updateForm = new FormGroup({
      title: new FormControl(this.data.title, [Validators.required]),
      description: new FormControl(this.data.description, [Validators.required]),
    });
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.updateForm, field);
  }
}
