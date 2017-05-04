/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureNewComponent } from './lecture-new.component';

describe('LectureNewComponent', () => {
  let component: LectureNewComponent;
  let fixture: ComponentFixture<LectureNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
