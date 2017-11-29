import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitReportDetailsComponent } from './unit-report-details.component';

describe('UnitReportDetailsComponent', () => {
  let component: UnitReportDetailsComponent;
  let fixture: ComponentFixture<UnitReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
