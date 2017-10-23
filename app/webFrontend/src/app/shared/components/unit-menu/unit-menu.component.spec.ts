import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UnitMenuComponent} from './unit-menu.component';

describe('UnitMenuComponent', () => {
  let component: UnitMenuComponent;
  let fixture: ComponentFixture<UnitMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnitMenuComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
