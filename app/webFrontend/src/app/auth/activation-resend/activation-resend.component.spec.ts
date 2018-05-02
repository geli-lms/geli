/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {ActivationResendComponent} from './activation-resend.component';

describe('ActivationResendComponent', () => {
  let component: ActivationResendComponent;
  let fixture: ComponentFixture<ActivationResendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivationResendComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationResendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
