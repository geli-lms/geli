import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UnitGeneralInfoFormComponent} from './unit-general-info-form.component';

describe('UnitGeneralInfoFormComponent', () => {
  let component: UnitGeneralInfoFormComponent;
  let fixture: ComponentFixture<UnitGeneralInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnitGeneralInfoFormComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitGeneralInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
