import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  @Output() closePopupEvent = new EventEmitter<any>();

  user: any;
  constructor() { }

  ngOnInit(): void {
    if (sessionStorage.getItem('user')){
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
  }

  closePop(): any {
    return this.closePopupEvent.emit(null);
  }

  cancelRequest(): void {
    sessionStorage.removeItem('lead');
    this.closePop();
  }

}
