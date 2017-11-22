import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSelectorComponent } from './unit-selector.component';

describe('UnitSelectorComponent', () => {
  let component: UnitSelectorComponent;
  let fixture: ComponentFixture<UnitSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
