import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ToggleAllCatagoriesService {

  displayAll: boolean = false;
  private approvalStageMessage = new BehaviorSubject(this.displayAll);
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  constructor() {

  }
  updateDisplayAllCatagoriesFlag(value: boolean) {
    console.log(value);
    this.approvalStageMessage.next(value);
  }
}
