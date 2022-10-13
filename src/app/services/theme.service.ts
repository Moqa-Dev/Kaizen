import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  availableThemes: string[] = [ 'kaizen-light' , 'kaizen-dark' ];

  // Default to 'light' theme
  currentTheme: string = this.availableThemes[0];

  // Inject document which is safe when used with server-side rendering
  constructor(@Inject(DOCUMENT) private document: Document) {
    //get last theme from local storage or use default theme
    var value = localStorage.getItem('theme')?.toString();
    this.switchTheme(value!==undefined? value : this.currentTheme);
  }

  initTheme(){
    this.document.body.classList.add(this.currentTheme);
    this.document.body.classList.add('mat-app-background');
  }

  // Swap them out, and keep track of the new theme
  switchTheme(newTheme: string): void {
    if(!this.availableThemes.includes(newTheme))
      return;
    localStorage.setItem('theme', newTheme);
    this.document.body.classList.replace(this.currentTheme.toString(), newTheme.toString());
    this.currentTheme = newTheme;
  }
  
}
