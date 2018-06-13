import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingInputFieldComponent } from './messaging-input-field.component';

describe('MessagingInputFieldComponent', () => {
  let component: MessagingInputFieldComponent;
  let fixture: ComponentFixture<MessagingInputFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagingInputFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
