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
import { Topic } from '../../models/api-models/Topic';
import { TopicsService } from '../../services/topics.service';
import { UpdateTopicDTO } from '../../models/api-models/dtos/UpdateTopicDTO';
import { UpdateTopicDialogComponent } from './update-topic-dialog/update-topic-dialog.component';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
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
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
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
export class TopicsComponent {

  title: string = 'Topics';
  itemsResultSet: ResultSet<Topic> = new ResultSet<Topic>();
  exportItemsResultSet: ResultSet<Topic> = new ResultSet<Topic>();

  columns: string[] = [];
  displayedColumns: string[] = [];
  rowMenuActions: string[][] = [
    ['info', 'Details'],  
    ['edit', 'Update'], 
    ['delete', 'Delete'],
  ];

  itemsForExport: any[] = [];

  sort: Sort;

  filters: Filter[] = [];

  filtersToApply: any;

  constructor(
    private topicsService: TopicsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
  }

  getAll(event: PageEvent) {
    this.topicsService.getAll(event.pageSize, (event.pageSize * event.pageIndex), this.sort, this.filtersToApply).subscribe(response => {
      if (response) {
        this.itemsResultSet = response;
        this.itemsResultSet.value.forEach(function(item) {
          item.updateDateString = Utils.formatDateToString(item.updateDate);
          item.creationDateString = Utils.formatDateToString(item.creationDate);
          item.userString = item.user.userName;
        });
        this.itemsResultSet.pageIndex = event.pageIndex;
        this.columns = ['id', 'title', 'description', 'creationDateString', 'updateDateString', 'userString'];
        this.displayedColumns = ['Id', 'Title', 'Description', 'CreationDate', 'UpdateDate', 'User'];
      }
    });
  }

  getById(item: any) {
    this.topicsService.getById(item.id).subscribe(response => {
      if (response) {
        this.dialog.open(ViewPopupComponent, {
          width: '50%',
          maxWidth: '50%',
          data: {
            title: 'Topic details',
            Id: response.id,
            Topic: response.title,
            Description: response.description,
            CreationDate: response.creationDate,
            UpdateDate: response.updateDate,
            Posts: response.posts.map(p=> p.title)?.join(', '),
            User: response.user.userName,
          }
        });
      }
    });
  }

  applyAction(action: string, item: Topic) {
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
        this.topicsService.deleteItem(originalItem.id).subscribe(() => {
          this.refreshPage();
          this.showNotification('Item deleted successfully', NotificationLevel.SUCCESS);
        });
      }
    });
  }

  AddItem() {
    let dialogRef = this.dialog.open(AddTopicDialogComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let item: UpdateTopicDTO = new UpdateTopicDTO();
        item.title = response.controls.title.value;
        item.description = response.controls.description.value;
        this.topicsService.AddItem(item).subscribe(response => {
          if (response) {
            this.refreshPage();
            this.showNotification('Item added successfully', NotificationLevel.SUCCESS);
          }
        });
      }
    });
  }

  updateItem(originalItem: any) {
    let dialogRef = this.dialog.open(UpdateTopicDialogComponent, {
      width: Utils.isMobile() ? '70%' : '50%',
      maxWidth: Utils.isMobile() ? '70%' : '50%',
      disableClose: true,
      data: originalItem
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response instanceof FormGroup) {
        let item: UpdateTopicDTO = new UpdateTopicDTO();
        item.title = response.controls.title.value;
        item.description = response.controls.description.value;
        this.topicsService.updateItem(originalItem.id, item).subscribe(() => {
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
