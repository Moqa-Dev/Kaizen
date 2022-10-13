import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
//import 'rxjs/add/operator/filter';
import {LoginService} from "../../services/login.service";
import {ProgressBarService} from "../../services/progress-bar.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationLevel} from "../../models/enums/code-enums/notification-level";
import {SnackBarComponent} from "../../components/snack-bar/snack-bar.component";
import Utils from "../../util/Utils";

//declare const $: any;

@Component({
  selector: 'kz-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  title = 'Kaizen - Admin';

  isMobileView: boolean = false;
  showProgressBar: boolean = false;
  showSidebar: boolean = !Utils.isMobile();



  constructor(
    private snackBar: MatSnackBar,
    public loginService: LoginService,
    private progressBarService: ProgressBarService,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.isMobile();
    this.progressBarService.currentAction.subscribe(action => {
      this.showProgressBar = action;
      this.changeDetector.detectChanges();
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  
  /*@HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    // let max = document.documentElement.scrollHeight;

    if (pos > 0) {
      this.showSidebar = false;
    }
  }*/

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    let rememberMe: string = localStorage.getItem('rememberMe');
    if (rememberMe != null && rememberMe != '') {
      if (!(rememberMe.toLowerCase() == 'true')) {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('token');
        localStorage.removeItem('pageSize');
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showSidebar = event.target.innerWidth >= 1200;
    this.isMobile();
  }

  isMobile() {
    this.isMobileView = Utils.isMobile();
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
