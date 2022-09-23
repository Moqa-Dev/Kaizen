import {AbstractControl, ValidatorFn} from "@angular/forms";

export function noWhiteSpace(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let isWhiteSpace = false;
    if (control && control.value && control.value.length == 0) {
      isWhiteSpace = false;
    } else if (control && control.value) {
      isWhiteSpace = control.value.trim().length == 0;
    }

    return !isWhiteSpace ? null : {'isWhiteSpace': true};
  };
}
