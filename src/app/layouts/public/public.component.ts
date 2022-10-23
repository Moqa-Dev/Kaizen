import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProgressBarService} from "../../services/progress-bar.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import Utils from "../../util/Utils";
import { PublicPostDto } from 'src/app/models/api-models/PublicPostDto';
import { PublicPostsService } from 'src/app/services/public-posts.service';

@Component({
  selector: 'kz-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  title = 'Kaizen - Posts';

  page = 0;
  posts: PublicPostDto[] = []

  isMobileView: boolean = false;
  showProgressBar: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private progressBarService: ProgressBarService,
    private publicPostsService: PublicPostsService
  ) {
  }

  ngOnInit() {
    console.log("init");
    this.progressBarService.currentAction.subscribe(action => {
      this.showProgressBar = action;
    });
    this.publicPostsService.getAll(this.page).subscribe((posts: PublicPostDto[]) => {
      this.posts = posts;
      console.log(this.posts);
   });
   console.log(this.posts);
  }

  onScroll(): void {
    console.log("scroll");
    this.publicPostsService.getAll(++this.page).subscribe((posts: PublicPostDto[]) => {
      this.posts.push(...posts);
      console.log(this.posts);
   });
  }

  
  

  showNotification(error: string, level: NotificationLevel) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: [Utils.notificationLevel(level)],
      data: {
        message: error
      }
    });
  }
}
