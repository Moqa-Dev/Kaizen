import {Component, OnInit} from '@angular/core';
import {ResultSet} from "../../models/result-set";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {PageEvent} from "@angular/material/paginator";
import {ViewPopupComponent} from "../../components/view-popup/view-popup.component";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import Utils from "../../util/Utils";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {Filter} from "../../models/filter";
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopupComponent } from '../../components/confirmation-popup/confirmation-popup.component';
import { Post } from '../../models/api-models/Post';
import { PostsService } from '../../services/posts.service';
import { UpdatePostDTO } from '../../models/api-models/dtos/UpdatePostDTO';
import { UpdatePostDialogComponent } from './update-post-dialog/update-post-dialog.component';
import { AddPostDialogComponent } from './add-post-dialog/add-post-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent } from 'src/app/components/data-table/data-table/data-table.component';
import { getColorOf, PostStatus } from 'src/app/models/enums/api-enums/post-status';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
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
    MatSnackBarModule
  ]
})
export class PostsComponent {

  title: string = 'Posts';
  itemsResultSet: ResultSet<Post> = new ResultSet<Post>();
  exportItemsResultSet: ResultSet<Post> = new ResultSet<Post>();

  columns: string[] = [];
  displayedColumns: string[] = [];
  rowMenuActions: string[][] = [
    ['info', 'Details'],  
    ['edit', 'Update'], 
    ['delete', 'Delete'],
  ];

  itemsForExport: any[] = [];

  sort: Sort;

  PostStatuses: string[] = Object.keys(PostStatus).map(s => {
    if (typeof PostStatus[s] === 'string')
      return PostStatus[s];
  }).filter((function (element) {
    return element != undefined;
  }));

  filters: Filter[] = [
    {displayName: 'PostStatus',
      optionsArray: this.PostStatuses,
      parameter: 'status',
      value: 'All'}
  ];

  filtersToApply: any;

  constructor(
    private postsService: PostsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
  }

  getAll(event: PageEvent) {
    this.postsService.getAll(event.pageSize, (event.pageSize * event.pageIndex), this.sort, this.filtersToApply).subscribe(response => {
      if (response) {
        this.itemsResultSet = response;
        this.itemsResultSet.value.forEach(function(item) {
          item.statusToRepresent = new Map<string, string>();
          item.statusToRepresent.set('color', getColorOf(item.status));
          item.statusToRepresent.set('state', item.status.toString());

          item.updateDateString = Utils.formatDateToString(item.updateDate);
          item.creationDateString = Utils.formatDateToString(item.creationDate);
          item.topicString = item.topic.title;
          item.userString = item.user.userName;
        });
        this.itemsResultSet.pageIndex = event.pageIndex;
        this.columns = ['id', 'title', 'statusToRepresent', 'topicString', 'creationDateString', 'updateDateString', 'userString'];
        this.displayedColumns = ['Id', 'Title', 'Status', 'Topic', 'Creation Date', 'Update Date', 'User'];
      }
    });
  }

  getById(item: any) {
    this.postsService.getById(item.postID).subscribe(response => {
      if (response) {
        console.log(response);
        this.dialog.open(ViewPopupComponent, {
          width: '50%',
          maxWidth: '50%',
          data: {
            title: 'Post details',
            Id: response.id,
            Title: response.title,
            Content: response.content,
            Status: response.status,
            creationDate: response.creationDate,
            updateDate: response.updateDate,
            topic: response.topic.title,
            user: response.user.userName,
          }
        });
      }
    });
  }

  applyAction(action: string, item: Post) {
    if (action == 'Details') {
      this.getById(item);
    } else if (action == 'Update') {
      this.updateItem(item);
    } else if (action == 'Delete') {
      this.deleteItem(item);
    }
  }


  deleteItem(originalItem: any) {
    let confirmDialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      data: {
        message: `Are you sure to delete "${originalItem.title}"?`,
        ok: 'Delete',
        cancel: 'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(action => {
      if (action == 'ok') {
        this.postsService.deleteItem(originalItem.id).subscribe(() => {
          this.refreshPage();
          this.showNotification('Item deleted successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  AddItem() {
    let dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let item: UpdatePostDTO = new UpdatePostDTO();
        item.title = response.controls.title.value;
        item.content = response.controls.content.value;
        item.status = response.controls.status.value;
        item.topicId = response.controls.topicID.value;
        this.postsService.AddItem(item).subscribe(response => {
          if (response) {
            this.refreshPage();
            this.showNotification('Item added successfully', NotificationLevel.SUCCESS);
          }
        });
      }
    });
  }

  updateItem(originalItem: any) {
    let dialogRef = this.dialog.open(UpdatePostDialogComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      disableClose: true,
      data: originalItem
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let item: UpdatePostDTO = new UpdatePostDTO();
        item.title = response.controls.title.value;
        item.content = response.controls.content.value;
        item.status = response.controls.status.value;
        item.topicId = response.controls.topicID.value;
        this.postsService.updateItem(originalItem.id, item).subscribe(() => {
          this.refreshPage();
          this.showNotification('item updated successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  applyFilter(event: any) {
    this.filtersToApply = event;
    this.refreshPage();
  }

  refreshPage() {
    let pageEvent: PageEvent = new PageEvent();
    pageEvent.pageSize = Utils.getCurrentPagination();
    pageEvent.pageIndex = 0;
    this.getAll(pageEvent);
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
