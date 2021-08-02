import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyEnquiriesComponent } from './reply-enquiries.component';

describe('ReplyEnquiriesComponent', () => {
  let component: ReplyEnquiriesComponent;
  let fixture: ComponentFixture<ReplyEnquiriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyEnquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
