import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CourseManageContentComponent} from './course-manage-content.component';

describe('CourseManageContentComponent', () => {
  let component: CourseManageContentComponent;
  let fixture: ComponentFixture<CourseManageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseManageContentComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseManageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
