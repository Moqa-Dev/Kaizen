import {NotificationLevel} from "../models/enums/code-enums/notification-level";
import {FormGroup} from "@angular/forms";
import {PaginationSize} from "../models/enums/code-enums/pagination-size";

//declare const $: any;

export default class Utils {
  // capitalize the first character in a string
  static toPascalCase(input: string): string {
    let firstChar: string = input.substr(0, 1);
    let wordRest: string = input.substr(1);
    return firstChar.toUpperCase() + wordRest;
  }

  // separate words in a camel case string to form a sentence like
  static separateWords(input: string): string {
    for (let i = 1; i < input.length; i++) {
      if (input[i] == input[i].toUpperCase()) {
        input = input.replace(input[i], ' ' + input[i]);
        i++;
      }
    }

    return input;
  }

  // return values are css classes defined in styles.scss
  static notificationLevel(level: NotificationLevel): string {
    if (level == NotificationLevel.SUCCESS) {
      return 'snackbar-success';
    } else if (level == NotificationLevel.ERROR) {
      return 'snackbar-error';
    }
    return '';
  }

  static getErrorMessage(form: FormGroup, field: string): string {
    if (form.controls[field].hasError('isWhiteSpace')) {
      return 'This field is required and cannot be just spaces';
    } else if (form.controls[field].hasError('haveInSpace')) {
      return 'This field cannot have spaces, just letters and digits';
    } else if (form.controls[field].hasError('required')) {
      return 'This field is required';
    } else if (form.controls[field].hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  static formatDateToString(date: Date): string {
    return new Date(date).toLocaleString('en-GB');
  }

  static isColor(strColor: string){
    let s = new Option().style;
    s.color = strColor;
    let test1 = s.color == strColor;
    let test2 = /^#[0-9A-F]{6}$/i.test(strColor);
    return test1 || test2;
  }

  static getCurrentPagination() {
    let pagination: string = localStorage.getItem('pageSize');
    if (pagination == null || pagination == '') {
      pagination = PaginationSize.FIRST.toString();
      localStorage.setItem('pageSize', pagination);
    } else if (parseInt(pagination) < PaginationSize.FIRST) {
      pagination = PaginationSize.FIRST.toString();
    }
    return parseInt(pagination);
  }

  static isMobile() {
    //this.innerWidth = window.innerWidth;
    return window.innerWidth <= 991;
  }
}
