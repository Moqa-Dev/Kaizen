import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {noInSpaces} from "../../../validators/noInSpaces";
import Utils from "../../../util/Utils";
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Post } from 'src/app/models/api-models/Post';
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
import { UpdatePostDTO } from 'src/app/models/api-models/dtos/UpdatePostDTO';
import { PostStatus } from 'src/app/models/enums/api-enums/post-status';
import { Topic } from 'src/app/models/api-models/Topic';
import { TopicsService } from 'src/app/services/topics.service';

@Component({
  selector: 'app-update-post-dialog',
  templateUrl: './update-post-dialog.component.html',
  styleUrls: ['./update-post-dialog.component.scss'],
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
export class UpdatePostDialogComponent {

  updateForm: FormGroup;
  topicsDropdown: Topic[] = [];
  postStatuses: string[] = Object.keys(PostStatus).map(l => {
    if (typeof PostStatus[l] === 'string')
      return PostStatus[l];
  }).filter((function (element) {
    return element != undefined;
  }));

  constructor(
    private topicsService: TopicsService,
    @Inject(MAT_DIALOG_DATA) public data: UpdatePostDTO) {
      this.getTopicsForDropdown();
      this.initForm();
  }

  initForm() {
    this.updateForm = new FormGroup({
      title: new FormControl(this.data.title, [Validators.required]),
      content: new FormControl(this.data.content, [Validators.required]),
      status: new FormControl(this.data.status, [Validators.required]),
      topicId: new FormControl(this.data.topicId, [Validators.required]),
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
    return Utils.getErrorMessage(this.updateForm, field);
  }
}
