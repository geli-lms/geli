import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCheckboxComponent } from './unit-checkbox.component';

describe('UnitCheckboxComponent', () => {
  let component: UnitCheckboxComponent;
  let fixture: ComponentFixture<UnitCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
