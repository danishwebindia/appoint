import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCustomerCareComponent } from './contact-customer-care.component';

describe('ContactCustomerCareComponent', () => {
  let component: ContactCustomerCareComponent;
  let fixture: ComponentFixture<ContactCustomerCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCustomerCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCustomerCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
