import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseForumComponent } from './course-forum.component';

describe('CourseForumComponent', () => {
  let component: CourseForumComponent;
  let fixture: ComponentFixture<CourseForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
