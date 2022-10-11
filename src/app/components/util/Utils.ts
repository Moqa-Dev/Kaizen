import {FormGroup} from "@angular/forms";
import {PaginationSize} from "../models/pagination-size";

declare const $: any;

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
    return $(window).width() <= 991;
  }
}
