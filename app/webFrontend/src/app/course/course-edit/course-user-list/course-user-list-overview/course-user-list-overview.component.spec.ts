import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUserListOverviewComponent } from './course-user-list-overview.component';

describe('CourseUserListOverviewComponent', () => {
  let component: CourseUserListOverviewComponent;
  let fixture: ComponentFixture<CourseUserListOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseUserListOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseUserListOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
