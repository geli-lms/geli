import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CourseUserListComponent} from './course-user-list.component';

describe('CourseUserListComponent', () => {
  let component: CourseUserListComponent;
  let fixture: ComponentFixture<CourseUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseUserListComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
