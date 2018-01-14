import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCourseDialogComponent } from './download-course-dialog.component';

describe('DownloadCourseDialogComponent', () => {
  let component: DownloadCourseDialogComponent;
  let fixture: ComponentFixture<DownloadCourseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadCourseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
