import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-customer-care',
  templateUrl: './contact-customer-care.component.html',
  styleUrls: ['./contact-customer-care.component.css']
})
export class ContactCustomerCareComponent implements OnInit {

  @Output() closePopupEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  closePop(): any {
    return this.closePopupEvent.emit(null);
  }

  cancelRequest(): void {
    this.closePop();
  }
}
