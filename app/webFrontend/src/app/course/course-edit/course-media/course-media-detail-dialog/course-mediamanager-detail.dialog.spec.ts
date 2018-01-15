import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMediamanagerDetail.DialogComponent } from './course-media-detail-dialog.component';

describe('CourseMediamanagerDetail.DialogComponent', () => {
  let component: CourseMediamanagerDetail.DialogComponent;
  let fixture: ComponentFixture<CourseMediamanagerDetail.DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseMediamanagerDetail.DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseMediamanagerDetail.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
