import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureCheckboxComponent } from './lecture-checkbox.component';

describe('LectureCheckboxComponent', () => {
  let component: LectureCheckboxComponent;
  let fixture: ComponentFixture<LectureCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
