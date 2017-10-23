import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeacherReportComponent} from './teacher-report.component';

describe('TeacherReportComponent', () => {
  let component: TeacherReportComponent;
  let fixture: ComponentFixture<TeacherReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherReportComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
