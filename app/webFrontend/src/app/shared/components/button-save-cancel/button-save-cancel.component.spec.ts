import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSaveCancelComponent } from './button-save-cancel.component';

describe('ButtonSaveCancelComponent', () => {
  let component: ButtonSaveCancelComponent;
  let fixture: ComponentFixture<ButtonSaveCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonSaveCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSaveCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
