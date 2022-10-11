import {Component, OnInit, ElementRef, Output, EventEmitter, Input, Inject} from '@angular/core';
import {ALLROUTES} from '../sidebar/sidebar.component';
import {CommonModule, Location} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {LoginService} from "../../services/login.service";
import {Title} from "@angular/platform-browser";
import { DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ]
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  elem: any;

  @Output() showSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  sidebar_state: boolean = false;

  @Input() isMobile: boolean = false;

  selectedTheme: string;
  availableThemes: string[];

  constructor(location: Location,
              private element: ElementRef,
              private router: Router,
              public loginService: LoginService,
              public themeService: ThemeService,
              private titleService: Title,
              @Inject(DOCUMENT) private document: any) {
    this.selectedTheme = themeService.currentTheme;
    this.availableThemes = themeService.availableThemes;
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.elem = document.documentElement;
    this.listTitles = ALLROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      let $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  getTitle() {
    return this.titleService.getTitle().split(' - ')[1];
  }

  goToProfile() {
    this.router.navigate(['admin/profile'])
  }

  /*addUser() {
    this.router.navigate(['register']);
  }*/

  isLoggedIn(): boolean{
    return this.loginService.isLoggedIn();
    //return false;
  }
  logout() {
    this.loginService.logout();
  }

  toggleSidebar() {
    this.sidebar_state = !this.sidebar_state;
    this.showSidebar.emit(this.sidebar_state);
  }
  darkMode:boolean = false;
  toggleDarkMode(){
    this.darkMode = !this.darkMode;
    if(this.darkMode)
      this.themeService.switchTheme(this.themeService.availableThemes[1]);
    else
      this.themeService.switchTheme(this.themeService.availableThemes[0]);

    // if(this.darkMode){
    //   enableDarkMode({
    //     brightness: 100,
    //     contrast: 100,
    //     sepia: 0
    // });
    // }else{
    //   disableDarkMode();
    // }
  }
  fullscreen:boolean = false;
  toggleFullscreen(){
    this.fullscreen = !this.fullscreen;
    if(this.fullscreen){
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    }else{
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
