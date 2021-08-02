import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskExpertsComponent } from './ask-experts.component';

describe('AskExpertsComponent', () => {
  let component: AskExpertsComponent;
  let fixture: ComponentFixture<AskExpertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskExpertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
