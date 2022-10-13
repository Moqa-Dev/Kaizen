import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  private action = new BehaviorSubject<boolean>(false);
  currentAction = this.action.asObservable();

  constructor() {
  }

  show(val: boolean) {
    this.action.next(val);
  }
}
