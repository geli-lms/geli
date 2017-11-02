/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {CourseNewComponent} from './course-new.component';

describe('CourseNewComponent', () => {
  let component: CourseNewComponent;
  let fixture: ComponentFixture<CourseNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseNewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
