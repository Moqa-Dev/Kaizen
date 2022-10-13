import {AbstractControl, ValidatorFn} from "@angular/forms";

export function noInSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let haveInSpace = false;
    if (control && control.value && control.value.length == 0) {
      haveInSpace = false;
    } else if (control && control.value) {
      haveInSpace = control.value.indexOf(' ') >= 0;
    }

    return !haveInSpace ? null : {'haveInSpace': true};
  };
}
