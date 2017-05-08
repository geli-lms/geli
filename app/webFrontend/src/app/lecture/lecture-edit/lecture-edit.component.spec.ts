/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureEditComponent } from './lecture-edit.component';

describe('LectureEditComponent', () => {
  let component: LectureEditComponent;
  let fixture: ComponentFixture<LectureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
