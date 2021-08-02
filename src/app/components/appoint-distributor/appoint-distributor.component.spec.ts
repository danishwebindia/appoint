import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointDistributorComponent } from './appoint-distributor.component';

describe('AppointDistributorComponent', () => {
  let component: AppointDistributorComponent;
  let fixture: ComponentFixture<AppointDistributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointDistributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointDistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
