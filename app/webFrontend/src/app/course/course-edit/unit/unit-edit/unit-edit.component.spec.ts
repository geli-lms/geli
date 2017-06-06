import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitEditComponent } from './unit-edit.component';

describe('UnitEditComponent', () => {
  let component: UnitEditComponent;
  let fixture: ComponentFixture<UnitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
