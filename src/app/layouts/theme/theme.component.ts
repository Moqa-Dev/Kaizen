import { Component, Inject } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'kz-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent {
  title = 'Kaizen - Theme';
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
