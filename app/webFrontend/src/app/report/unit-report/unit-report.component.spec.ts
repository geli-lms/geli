import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitReportComponent } from './unit-report.component';

describe('UnitReportComponent', () => {
  let component: UnitReportComponent;
  let fixture: ComponentFixture<UnitReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
