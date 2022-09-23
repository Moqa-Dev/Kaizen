import { Component, Inject } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'kz-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  title = 'Kaizen - Admin';
  selectedTheme: string;
  availableThemes: string[];

  constructor(private themeService: ThemeService) {
    this.selectedTheme = themeService.currentTheme;
    this.availableThemes = themeService.availableThemes;
  }

  changeTheme(event: MatOptionSelectionChange){
    if(!event.isUserInput)
      return;
    this.themeService.switchTheme(event.source.value);
  }
}
