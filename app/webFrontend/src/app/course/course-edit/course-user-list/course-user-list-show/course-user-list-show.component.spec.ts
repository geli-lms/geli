import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUserListShowComponent } from './course-user-list-show.component';

describe('CourseUserListShowComponent', () => {
  let component: CourseUserListShowComponent;
  let fixture: ComponentFixture<CourseUserListShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseUserListShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseUserListShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
