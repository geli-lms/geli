import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMediamanagerComponent } from './course-mediamanager.component';

describe('CourseMediamanagerComponent', () => {
  let component: CourseMediamanagerComponent;
  let fixture: ComponentFixture<CourseMediamanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseMediamanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseMediamanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
