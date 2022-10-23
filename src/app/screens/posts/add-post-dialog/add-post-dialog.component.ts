import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {noInSpaces} from "../../../validators/noInSpaces";
import Utils from "../../../util/Utils";
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
import { Topic } from 'src/app/models/api-models/Topic';
import { PostStatus } from 'src/app/models/enums/api-enums/post-status';
import { TopicsService } from 'src/app/services/topics.service';

@Component({
  selector: 'app-add-post-dialog',
  templateUrl: './add-post-dialog.component.html',
  styleUrls: ['./add-post-dialog.component.scss'],
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
export class AddPostDialogComponent {

  addForm: FormGroup;
  topicsDropdown: Topic[] = [];
  postStatuses: string[] = Object.keys(PostStatus).map(l => {
    if (typeof PostStatus[l] === 'string')
      return PostStatus[l];
  }).filter((function (element) {
    return element != undefined;
  }));


  constructor(private topicsService: TopicsService) {
    this.getTopicsForDropdown();
    this.initForm();
  }

  initForm() {
    this.addForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      topicId: new FormControl(null, [Validators.required]),
    });
  }

  getTopicsForDropdown() {
    this.topicsService.geItemsForDropdown().subscribe(response => {
      if (response.value.length > 0) {
        this.topicsDropdown = response.value;
      }
    });
  }

  getErrorMessage(field: string): string {
    return Utils.getErrorMessage(this.addForm, field);
  }
}
