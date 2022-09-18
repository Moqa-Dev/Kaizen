import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

// Create a type that accepts either the string 'light' or 'dark' only
enum Theme { 'kaizen-light' =1 , 'kaizen-dark' =2}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Default to 'light' theme
  currentTheme: Theme = Theme['kaizen-light'];
  
  //TODO: Move to service


  // Inject document which is safe when used with server-side rendering
  constructor(@Inject(DOCUMENT) private document: Document) {
    //get last theme from local storage or use default theme
    var value = localStorage.getItem('theme')?.toString();

    if(value !== undefined && value.length>0){
      var theme:Theme = <Theme> <unknown> value;
      if(theme !== undefined)
        this.currentTheme = theme;
    }
    // Add the current (light) theme as a default
    this.document.body.classList.add(this.currentTheme.toString());
  }

  // Swap them out, and keep track of the new theme
  switchTheme(newTheme: Theme): void {
    this.document.body.classList.replace(this.currentTheme.toString(), newTheme.toString())
    this.currentTheme = newTheme;
  }

}
